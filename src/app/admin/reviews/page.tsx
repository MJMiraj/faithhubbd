import { db } from "@/lib/db";
import { MessageSquare, Check, Trash2, Star, X } from "lucide-react";
import { approveReview, deleteReview } from "./actions";
import Image from "next/image";

export default async function ReviewsPage() {
  const reviews = await db.productReview.findMany({
    include: {
      product: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          }
        }
      },
      user: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 dark:text-white tracking-tight">Product Reviews</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Moderate customer reviews and feedback.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No Reviews Yet</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              When customers leave reviews on your products, they will appear here for moderation.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 flex flex-col md:flex-row gap-6 items-start">
                
                {/* Product Info */}
                <div className="flex items-center gap-4 w-full md:w-1/4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden relative flex-shrink-0">
                    {review.product.images[0] ? (
                      <img 
                        src={review.product.images[0].url} 
                        alt={review.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400 font-bold">NO IMG</div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{review.product.name}</p>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">By {review.user.firstName}</p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />
                    ))}
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  {!review.isApproved ? (
                    <form action={async () => {
                      "use server";
                      await approveReview(review.id);
                    }}>
                      <button type="submit" className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                        <Check className="w-4 h-4" /> Approve
                      </button>
                    </form>
                  ) : (
                    <span className="flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-xl text-sm font-bold">
                      <Check className="w-4 h-4" /> Approved
                    </span>
                  )}
                  
                  <form action={async () => {
                    "use server";
                    await deleteReview(review.id);
                  }}>
                    <button type="submit" className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </form>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
