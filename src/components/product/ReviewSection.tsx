"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { submitReview } from "./actions";

type ReviewSectionProps = {
  productId: string;
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: { firstName: string | null, lastName: string | null };
  }[];
  isLoggedIn: boolean;
};

export function ReviewSection({ productId, reviews, isLoggedIn }: ReviewSectionProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setErrorMessage("Please log in to leave a review.");
      setStatus("error");
      return;
    }
    
    setStatus("loading");
    const result = await submitReview(productId, rating, comment);
    
    if (result.error) {
      setErrorMessage(result.error);
      setStatus("error");
    } else {
      setStatus("success");
      setComment("");
      setRating(5);
    }
  };

  return (
    <div className="mt-20 pt-16 border-t border-gray-100 dark:border-gray-800 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-black font-heading tracking-tight text-gray-900 dark:text-white mb-10">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Leave a Review Form */}
        <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 h-fit">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Write a Review</h3>
          
          {status === "success" ? (
            <div className="p-4 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl font-bold text-center">
              Thank you! Your review has been submitted for moderation.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`w-8 h-8 transition-colors ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-700 hover:text-yellow-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2">Your Feedback</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike?"
                  className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-brand focus:outline-none dark:text-white resize-none mb-3"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2">Attach Photos (Optional)</label>
                <button 
                  type="button"
                  onClick={() => alert("Cloudinary widget will open here. Add your API keys to enable real uploads.")}
                  className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-brand hover:text-brand transition-colors bg-white dark:bg-gray-950"
                >
                  <span className="font-bold text-sm">Click to upload images</span>
                  <span className="text-xs mt-1 opacity-70">Powered by Cloudinary</span>
                </button>
              </div>

              {status === "error" && (
                <p className="text-red-500 font-bold text-sm">{errorMessage}</p>
              )}
              
              <button 
                type="submit" 
                disabled={status === "loading"}
                className="w-full bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === "loading" ? "Submitting..." : <><Send className="w-4 h-4" /> Submit Review</>}
              </button>
            </form>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 font-medium">No approved reviews yet. Be the first to leave one!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-black rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center font-bold text-lg">
                    {review.user.firstName?.[0] || "U"}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold text-gray-900 dark:text-white">{review.user.firstName} {review.user.lastName}</p>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
