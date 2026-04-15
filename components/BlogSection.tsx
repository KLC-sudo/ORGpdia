import React, { useState } from 'react';
import { useContent } from '../ContentContext';
import type { BlogPost } from '../types';

const BlogCard: React.FC<{ post: BlogPost; onClick: (post: BlogPost) => void }> = ({ post, onClick }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <article
      onClick={() => onClick(post)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col"
    >
      {post.image && (
        <div className="h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      {!post.image && (
        <div className="h-48 bg-gradient-to-br from-pdi-dark-blue to-pdi-red flex items-center justify-center">
          <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags?.map((tag, i) => (
            <span key={i} className="text-xs font-semibold bg-pdi-red/10 text-pdi-red px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-bold text-pdi-dark-blue mb-2 group-hover:text-pdi-red transition-colors leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-pdi-gray leading-relaxed flex-1 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-pdi-dark-blue">{post.author}</p>
            <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
          <span className="text-pdi-red text-sm font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Read more
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};

const BlogModal: React.FC<{ post: BlogPost; onClose: () => void }> = ({ post, onClose }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {post.image && (
          <div className="h-64 overflow-hidden rounded-t-2xl">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-8">
          <button
            onClick={onClose}
            className="float-right ml-4 text-gray-400 hover:text-pdi-red transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag, i) => (
              <span key={i} className="text-xs font-semibold bg-pdi-red/10 text-pdi-red px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-pdi-dark-blue mb-3 leading-tight">
            {post.title}
          </h2>
          <div className="flex items-center gap-3 mb-6 text-sm text-gray-500">
            <span className="font-semibold text-pdi-dark-blue">{post.author}</span>
            <span>·</span>
            <span>{formattedDate}</span>
          </div>
          <div className="prose prose-lg max-w-none text-pdi-gray leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogSection: React.FC = () => {
  const { content } = useContent();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const publishedPosts = content.blog?.filter(p => p.published) ?? [];

  return (
    <>
      <section id="blog" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-pdi-dark-blue">
              {content.blogTitle || 'Insights & Updates'}
            </h2>
            <p className="mt-4 text-lg text-pdi-gray max-w-2xl mx-auto">
              {content.blogSubtitle || ''}
            </p>
          </div>
          {publishedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedPosts.map((post) => (
                <BlogCard key={post.id} post={post} onClick={setSelectedPost} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-pdi-gray">
              <svg className="mx-auto mb-4 w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-lg font-medium">No posts published yet.</p>
              <p className="text-sm mt-1">Check back soon for insights and updates.</p>
            </div>
          )}
        </div>
      </section>

      {selectedPost && (
        <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  );
};

export default BlogSection;
