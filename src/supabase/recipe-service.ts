import { supabase } from './supabase-config';

export interface Recipe {
  id: string;
  title_ar: string;
  title_en?: string;
  content_ar: string;
  content_en?: string;
  cooking_time_ar?: string;
  cooking_time_en?: string;
  image_url: string;
  type: 'blog' | 'recipe';
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  author_id?: string;
}

export const recipeService = {
  // ─── GET ALL RECIPES ────────────────────────────────────────────────────
  async getRecipes() {
    try {
      console.log('📚 Fetching all recipes...');
      
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching recipes:', error);
        return { success: false, error: error.message, data: [] };
      }

      console.log(`✅ Fetched ${data?.length || 0} recipes`);
      return { success: true, data: data || [], error: null };
    } catch (err: any) {
      console.error('❌ Exception in getRecipes:', err);
      return { success: false, error: err.message, data: [] };
    }
  },

  // ─── GET RECIPE BY ID ───────────────────────────────────────────────────
  async getRecipeById(id: string) {
    try {
      console.log(`📖 Fetching recipe: ${id}`);
      
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching recipe:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log(`✅ Fetched recipe: ${data.title_ar}`);
      return { success: true, data, error: null };
    } catch (err: any) {
      console.error('❌ Exception in getRecipeById:', err);
      return { success: false, error: err.message, data: null };
    }
  },

  // ─── ADD NEW RECIPE ─────────────────────────────────────────────────────
  async addRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) {
    try {
      console.log('➕ Adding new recipe:', recipe.title_ar);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('recipes')
        .insert([{
          ...recipe,
          author_id: user?.id,
          is_active: recipe.is_active !== undefined ? recipe.is_active : true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding recipe:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log(`✅ Recipe added successfully: ${data.title_ar}`);
      return { success: true, data, error: null };
    } catch (err: any) {
      console.error('❌ Exception in addRecipe:', err);
      return { success: false, error: err.message, data: null };
    }
  },

  // ─── UPDATE RECIPE ──────────────────────────────────────────────────────
  async updateRecipe(id: string, updates: Partial<Recipe>) {
    try {
      console.log(`✏️ Updating recipe: ${id}`);

      const { data, error } = await supabase
        .from('recipes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating recipe:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log(`✅ Recipe updated successfully: ${data.title_ar}`);
      return { success: true, data, error: null };
    } catch (err: any) {
      console.error('❌ Exception in updateRecipe:', err);
      return { success: false, error: err.message, data: null };
    }
  },

  // ─── DELETE RECIPE ──────────────────────────────────────────────────────
  async deleteRecipe(id: string) {
    try {
      console.log(`🗑️ Deleting recipe: ${id}`);

      // Option 1: Soft delete (recommended)
      const { data, error } = await supabase
        .from('recipes')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      // Option 2: Hard delete (uncomment if you prefer)
      // const { data, error } = await supabase
      //   .from('recipes')
      //   .delete()
      //   .eq('id', id)
      //   .select()
      //   .single();

      if (error) {
        console.error('❌ Error deleting recipe:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log(`✅ Recipe deleted successfully`);
      return { success: true, data, error: null };
    } catch (err: any) {
      console.error('❌ Exception in deleteRecipe:', err);
      return { success: false, error: err.message, data: null };
    }
  },

  // ─── GET RECIPES BY TYPE ────────────────────────────────────────────────
  async getRecipesByType(type: 'blog' | 'recipe') {
    try {
      console.log(`📚 Fetching ${type}s...`);
      
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('type', type)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching recipes by type:', error);
        return { success: false, error: error.message, data: [] };
      }

      console.log(`✅ Fetched ${data?.length || 0} ${type}s`);
      return { success: true, data: data || [], error: null };
    } catch (err: any) {
      console.error('❌ Exception in getRecipesByType:', err);
      return { success: false, error: err.message, data: [] };
    }
  },

  // ─── SEARCH RECIPES ─────────────────────────────────────────────────────
  async searchRecipes(query: string) {
    try {
      console.log(`🔍 Searching recipes: "${query}"`);
      // Supabase JS v2+ does not support .or() on the builder, so use multiple .ilike() and merge results
      const filters = [
        { column: 'title_ar', value: `%${query}%` },
        { column: 'title_en', value: `%${query}%` },
        { column: 'content_ar', value: `%${query}%` }
      ];
      let allResults: any[] = [];
      for (const f of filters) {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('is_active', true)
          .ilike(f.column, f.value)
          .order('created_at', { ascending: false });
        if (!error && data) {
          allResults = allResults.concat(data);
        }
      }
      // Remove duplicates by id
      const unique = Object.values(
        allResults.reduce((acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {})
      );
      console.log(`✅ Found ${unique.length} recipes`);
      return { success: true, data: unique, error: null };
    } catch (err: any) {
      console.error('❌ Exception in searchRecipes:', err);
      return { success: false, error: err.message, data: [] };
    }
  },

  // ─── TOGGLE ACTIVE STATUS ───────────────────────────────────────────────
  async toggleActive(id: string) {
    try {
      console.log(`🔄 Toggling recipe active status: ${id}`);

      // First, get current status
      const { data: current, error: fetchError } = await supabase
        .from('recipes')
        .select('is_active')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching recipe:', fetchError);
        return { success: false, error: fetchError.message, data: null };
      }

      // Toggle status
      const { data, error } = await supabase
        .from('recipes')
        .update({ 
          is_active: !current.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error toggling active status:', error);
        return { success: false, error: error.message, data: null };
      }

      console.log(`✅ Recipe status toggled to: ${data.is_active}`);
      return { success: true, data, error: null };
    } catch (err: any) {
      console.error('❌ Exception in toggleActive:', err);
      return { success: false, error: err.message, data: null };
    }
  }
};

export default recipeService;
