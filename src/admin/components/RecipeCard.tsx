import React from 'react';
import { Edit, Trash2, Clock, User, Eye } from 'lucide-react';

interface RecipeCardProps {
    recipe: any;
    onEdit: (recipe: any) => void;
    onDelete: (id: string) => void;
    onPreview?: (recipe: any) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onEdit, onDelete, onPreview }) => {
    return (
        <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden group hover:border-fruit-primary/30 transition-all duration-500 backdrop-blur-sm shadow-xl">
            <div className="h-48 overflow-hidden relative">
                <img
                    src={recipe.image_url || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=400'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    alt={recipe.title_ar}
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-black text-fruit-primary flex items-center gap-2">
                    <Clock size={12} />
                    {recipe.cooking_time_ar}
                </div>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase font-black tracking-widest mb-2">
                    <User size={12} />
                    {recipe.author || 'الأطيب'}
                </div>
                <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-fruit-primary transition-colors">{recipe.title_ar}</h3>
                <p className="text-white/40 text-xs line-clamp-2 mb-6 font-medium leading-relaxed">
                    {recipe.content_ar}
                </p>
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(recipe)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-fruit-primary/20 text-white/40 hover:text-fruit-primary transition-all"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(recipe.id)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-500/40 hover:text-red-500 transition-all"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    {onPreview && (
                        <button onClick={() => onPreview(recipe)} className="flex items-center gap-2 text-white/20 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                            <Eye size={14} />
                            عرض
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
