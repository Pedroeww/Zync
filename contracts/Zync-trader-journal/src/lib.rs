
#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, Vec,
};

#[contract]
pub struct ZyncTraderJournal;

#[contracttype]
#[derive(Clone)]
pub struct Trade {
    pub trader: Address,
    pub asset: Symbol,
    pub amount: i128,
    pub price: i128,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    TradeCount(Address),
    Trades(Address),
}

#[contractimpl]
impl ZyncTraderJournal {

    // Log a new trade on-chain
    pub fn log_trade(
        env: Env,
        trader: Address,
        asset: Symbol,
        amount: i128,
        price: i128,
    ) {
        trader.require_auth();

        let timestamp = env.ledger().timestamp();

        let trade = Trade {
            trader: trader.clone(),
            asset,
            amount,
            price,
            timestamp,
        };

        let key = DataKey::Trades(trader.clone());

        let mut trades: Vec<Trade> = env
            .storage()
            .instance()
            .get(&key)
            .unwrap_or(Vec::new(&env));

        trades.push_back(trade);

        env.storage().instance().set(&key, &trades);
    }

    // Calculate total PnL (simplified)
    pub fn calculate_pnl(env: Env, trader: Address) -> i128 {
        let key = DataKey::Trades(trader);

        let trades: Vec<Trade> = env
            .storage()
            .instance()
            .get(&key)
            .unwrap_or(Vec::new(&env));

        let mut pnl: i128 = 0;

        for trade in trades.iter() {
            pnl += trade.amount * trade.price;
        }

        pnl
    }

    // Emit verification event (journal integrity check)
    pub fn verify_journal(env: Env, trader: Address) -> bool {
        let key = DataKey::Trades(trader.clone());

        let exists = env.storage().instance().has(&key);

        let topic = symbol_short!("verify");
        env.events().publish((topic, trader), exists);

        exists
    }

    // Optional: reward trader with XLM if profitable (mock logic)
    pub fn reward_trader(env: Env, trader: Address, reward_amount: i128) {
        trader.require_auth();

        let pnl = Self::calculate_pnl(env.clone(), trader.clone());

        if pnl > 0 {
            let token_id = env.current_contract_address();
            let client = soroban_sdk::token::Client::new(&env, &token_id);

            client.transfer(&env.current_contract_address(), &trader, &reward_amount);
        }
    }
}