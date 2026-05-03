import { supabase } from '../supabaseClient';
import { Account, Trade, UserSettings } from '../types';

export const dataService = {
  // Accounts
  async getAccounts(): Promise<Account[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }

    // We need to fetch trades for each account separately or use a join
    // For simplicity and since accounts are few, we'll map them
    // But better to fetch all trades for all accounts in one go if possible
    const accounts: Account[] = await Promise.all(data.map(async (acc: any) => {
      const { data: trades, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .eq('account_id', acc.id)
        .order('entry_date', { ascending: false });

      if (tradesError) {
        console.error(`Error fetching trades for account ${acc.id}:`, tradesError);
        return {
          id: acc.id,
          name: acc.name,
          settings: acc.settings,
          trades: []
        };
      }

      return {
        id: acc.id,
        name: acc.name,
        settings: acc.settings,
        trades: await Promise.all(trades.map(async (t: any) => {
          let screenshotUrl = t.screenshot;
          let executionImageUrl = t.execution_image;

          if (t.screenshot && t.screenshot.startsWith(user.id)) {
            try {
              screenshotUrl = await this.getSignedUrl(t.screenshot);
            } catch (err) {
              console.warn('Failed to get signed URL for screenshot:', t.screenshot);
            }
          }

          if (t.execution_image && t.execution_image.startsWith(user.id)) {
            try {
              executionImageUrl = await this.getSignedUrl(t.execution_image);
            } catch (err) {
              console.warn('Failed to get signed URL for execution image:', t.execution_image);
            }
          }

          return {
            ...t,
            marketType: t.market_type,
            entryPrice: Number(t.entry_price),
            exitPrice: Number(t.exit_price),
            positionSize: Number(t.position_size),
            entryDate: t.entry_date,
            exitDate: t.exit_date,
            followedRules: t.followed_rules,
            mistakeTags: t.mistake_tags,
            pnlPercentage: Number(t.pnl_percentage),
            riskReward: Number(t.risk_reward),
            targetRR: Number(t.target_rr),
            exitStatus: t.exit_status,
            executionComments: t.execution_comments,
            screenshot: screenshotUrl,
            executionImage: executionImageUrl
          };
        }))
      };
    }));

    return accounts;
  },

  async createAccount(name: string, settings: UserSettings): Promise<Account> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('accounts')
      .insert([
        { user_id: user.id, name, settings }
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      settings: data.settings,
      trades: []
    };
  },

  async updateAccount(accountId: string, updates: Partial<{ name: string; settings: UserSettings }>) {
    const { error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', accountId);

    if (error) throw error;
  },

  async deleteAccount(accountId: string) {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', accountId);

    if (error) throw error;
  },

  // Storage
  async uploadFile(path: string, file: File): Promise<string> {
    const { data, error } = await supabase.storage
      .from('app-files')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
    return data.path;
  },

  async getSignedUrl(path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('app-files')
      .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) throw error;
    return data.signedUrl;
  },

  async deleteFile(path: string) {
    const { error } = await supabase.storage
      .from('app-files')
      .remove([path]);

    if (error) throw error;
  },

  // Trades
  async addTrade(accountId: string, trade: Trade): Promise<Trade> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Convert camelCase to snake_case for Postgres
    const tradeData = {
      account_id: accountId,
      user_id: user.id,
      asset: trade.asset,
      market_type: trade.marketType,
      entry_price: trade.entryPrice,
      exit_price: trade.exitPrice,
      position_size: trade.positionSize,
      side: trade.side,
      entry_date: trade.entryDate,
      exit_date: trade.exitDate,
      strategy: trade.strategy,
      notes: trade.notes,
      emotional_state: trade.emotionalState,
      confidence: trade.confidence,
      news_impact: trade.newsImpact,
      followed_rules: trade.followedRules,
      mistake_tags: trade.mistakeTags,
      pnl: trade.pnl,
      pnl_percentage: trade.pnlPercentage,
      risk_reward: trade.riskReward,
      target_rr: trade.targetRR,
      exit_status: trade.exitStatus,
      screenshot: trade.screenshot,
      execution_comments: trade.executionComments,
      execution_image: trade.executionImage
    };

    const { data, error } = await supabase
      .from('trades')
      .insert([tradeData])
      .select()
      .single();

    if (error) throw error;

    // Convert back to camelCase
    return {
      ...data,
      marketType: data.market_type,
      entryPrice: Number(data.entry_price),
      exitPrice: Number(data.exit_price),
      positionSize: Number(data.position_size),
      entryDate: data.entry_date,
      exitDate: data.exit_date,
      followedRules: data.followed_rules,
      mistakeTags: data.mistake_tags,
      pnlPercentage: Number(data.pnl_percentage),
      riskReward: Number(data.risk_reward),
      targetRR: Number(data.target_rr),
      exitStatus: data.exit_status,
      executionComments: data.execution_comments,
      executionImage: data.execution_image
    };
  },

  async updateTrade(tradeId: string, updates: Partial<Trade>) {
    // Convert camelCase to snake_case
    const dbUpdates: any = {};
    if (updates.asset !== undefined) dbUpdates.asset = updates.asset;
    if (updates.marketType !== undefined) dbUpdates.market_type = updates.marketType;
    if (updates.entryPrice !== undefined) dbUpdates.entry_price = updates.entryPrice;
    if (updates.exitPrice !== undefined) dbUpdates.exit_price = updates.exitPrice;
    if (updates.positionSize !== undefined) dbUpdates.position_size = updates.positionSize;
    if (updates.side !== undefined) dbUpdates.side = updates.side;
    if (updates.entryDate !== undefined) dbUpdates.entry_date = updates.entryDate;
    if (updates.exitDate !== undefined) dbUpdates.exit_date = updates.exitDate;
    if (updates.strategy !== undefined) dbUpdates.strategy = updates.strategy;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.emotionalState !== undefined) dbUpdates.emotional_state = updates.emotionalState;
    if (updates.confidence !== undefined) dbUpdates.confidence = updates.confidence;
    if (updates.newsImpact !== undefined) dbUpdates.news_impact = updates.newsImpact;
    if (updates.followedRules !== undefined) dbUpdates.followed_rules = updates.followedRules;
    if (updates.mistakeTags !== undefined) dbUpdates.mistake_tags = updates.mistakeTags;
    if (updates.pnl !== undefined) dbUpdates.pnl = updates.pnl;
    if (updates.pnlPercentage !== undefined) dbUpdates.pnl_percentage = updates.pnlPercentage;
    if (updates.riskReward !== undefined) dbUpdates.risk_reward = updates.riskReward;
    if (updates.targetRR !== undefined) dbUpdates.target_rr = updates.targetRR;
    if (updates.exitStatus !== undefined) dbUpdates.exit_status = updates.exitStatus;
    if (updates.screenshot !== undefined) dbUpdates.screenshot = updates.screenshot;
    if (updates.executionComments !== undefined) dbUpdates.execution_comments = updates.executionComments;
    if (updates.executionImage !== undefined) dbUpdates.execution_image = updates.executionImage;

    const { error } = await supabase
      .from('trades')
      .update(dbUpdates)
      .eq('id', tradeId);

    if (error) throw error;
  },

  async deleteTrade(tradeId: string) {
    // Fetch trade first to get file paths
    const { data: trade, error: fetchError } = await supabase
      .from('trades')
      .select('screenshot, execution_image, user_id')
      .eq('id', tradeId)
      .single();

    if (!fetchError && trade) {
      const filesToDelete = [];
      if (trade.screenshot && trade.screenshot.startsWith(trade.user_id)) {
        filesToDelete.push(trade.screenshot);
      }
      if (trade.execution_image && trade.execution_image.startsWith(trade.user_id)) {
        filesToDelete.push(trade.execution_image);
      }
      
      if (filesToDelete.length > 0) {
        try {
          await supabase.storage.from('app-files').remove(filesToDelete);
        } catch (err) {
          console.error('Failed to delete files during trade deletion:', err);
        }
      }
    }

    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', tradeId);

    if (error) throw error;
  }
};
