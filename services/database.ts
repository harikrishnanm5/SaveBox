import { supabase } from './supabase';
import { sha256 } from 'js-sha256';

// Hash phone number for privacy
const hashPhone = (phone: string): string => {
    return sha256(phone);
};

// Auth: Create or get user by phone
export const authenticateUser = async (phoneNumber: string) => {
    const phoneHash = hashPhone(phoneNumber);

    // Check if user exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone_hash', phoneHash)
        .single();

    if (existingUser) {
        // Update last login
        await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', existingUser.id);

        return existingUser;
    }

    // Create new user
    const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ phone_hash: phoneHash }])
        .select()
        .single();

    if (error) throw error;

    // Create savings account for new user
    await supabase
        .from('savings_accounts')
        .insert([{ user_id: newUser.id, balance: 0 }]);

    return newUser;
};

// Get user's savings account
export const getSavingsAccount = async (userId: string) => {
    const { data, error } = await supabase
        .from('savings_accounts')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) throw error;
    return data;
};

// Add money to savings
export const addMoney = async (userId: string, amount: number, title: string = 'Added Money') => {
    // Get account
    const account = await getSavingsAccount(userId);

    // Update balance
    const newBalance = parseFloat(account.balance) + amount;
    await supabase
        .from('savings_accounts')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', account.id);

    // Create transaction
    await supabase
        .from('transactions')
        .insert([{
            user_id: userId,
            account_id: account.id,
            amount,
            type: 'credit',
            category: 'Savings',
            title
        }]);

    return newBalance;
};

// Get user's transactions
export const getTransactions = async (userId: string, limit: number = 10) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data;
};

// Get user's goals
export const getGoals = async (userId: string) => {
    const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Create a new goal
export const createGoal = async (userId: string, goal: {
    title: string;
    target_amount: number;
    icon?: string;
    color?: string;
}) => {
    const { data, error } = await supabase
        .from('goals')
        .insert([{ user_id: userId, ...goal }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Test database connection
export const testConnection = async () => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count');

        if (error) throw error;
        return { success: true, message: 'Database connected!' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
