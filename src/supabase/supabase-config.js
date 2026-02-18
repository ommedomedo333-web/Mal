import { createClient } from '@supabase/supabase-js';

// محاكاة AsyncStorage لبيئة المتصفح
const AsyncStorage = {
  getItem: async (key) => {
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem: async (key, value) => {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: async (key) => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  }
};

// محاولة جلب المتغيرات من import.meta.env أو process.env كبديل
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : '');

// التحقق من صحة الإعدادات
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    supabaseUrl.includes('supabase.co') &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 50 // مفاتيح Supabase عادة ما تكون طويلة جداً (JWT)
  );
};

// تحقق من الـ session بعد Login
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Event:', event);
  console.log('App metadata:', session?.user?.app_metadata);
  console.log('Email:', session?.user?.email);
});

// تهيئة العميل فقط إذا كانت الإعدادات صالحة
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })
  : {
    // عميل وهمي لمنع الانهيار المفاجئ عند فقدان المفاتيح
    from: (table) => {
      const createFilterBuilder = () => {
        const mockResponse = { data: [], error: { message: 'Supabase API Key is missing or invalid (401)' } };
        const mockSingleResponse = { data: null, error: { message: 'Supabase API Key is missing or invalid (401)' } };

        return {
          then: (onFulfilled, onRejected) => Promise.resolve(mockResponse).then(onFulfilled, onRejected),
          catch: (onRejected) => Promise.resolve(mockResponse).catch(onRejected),
          finally: (onFinally) => Promise.resolve(mockResponse).finally(onFinally),

          select: () => createFilterBuilder(),
          eq: () => createFilterBuilder(),
          neq: () => createFilterBuilder(),
          gt: () => createFilterBuilder(),
          lt: () => createFilterBuilder(),
          gte: () => createFilterBuilder(),
          lte: () => createFilterBuilder(),
          like: () => createFilterBuilder(),
          ilike: () => createFilterBuilder(),
          is: () => createFilterBuilder(),
          in: () => createFilterBuilder(),
          contains: () => createFilterBuilder(),
          range: () => createFilterBuilder(),
          order: () => createFilterBuilder(),
          limit: () => createFilterBuilder(),

          single: () => Promise.resolve(mockSingleResponse),
          maybeSingle: () => Promise.resolve(mockSingleResponse),
          csv: () => Promise.resolve(mockSingleResponse),
        };
      };

      return {
        select: () => createFilterBuilder(),
        insert: () => createFilterBuilder(),
        update: () => createFilterBuilder(),
        delete: () => createFilterBuilder(),
        upsert: () => createFilterBuilder(),
      };
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => { } }) }),
      subscribe: () => ({ unsubscribe: () => { } })
    }),
    removeChannel: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
    rpc: () => Promise.resolve({ data: null, error: { message: 'Supabase API Key is missing or invalid (401)' } }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      resetPasswordForEmail: () => Promise.resolve({ data: {}, error: { message: 'Supabase not configured' } }),
      updateUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } })
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    functions: {
      invoke: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
    }
  };
