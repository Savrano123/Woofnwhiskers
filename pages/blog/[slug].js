import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';

export default function BlogPost({ post, relatedPosts }) {
  const router = useRouter();
  
  // If the page is still generating via SSR, show a loading state
  if (router.isFallback) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return (
    <div>
      <Head>
        <title>{post.title} | WoofnWhiskers Blog</title>
        <meta name="description" content={post.excerpt} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
      </Head>

      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton href="/blog" />
        </div>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {post.coverImage && (
            <div className="relative h-80 sm:h-96">
              <Image
                src={post.coverImage}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          )}
          
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              {post.category && (
                <>
                  <span className="mx-2">•</span>
                  <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>
                    <a className="hover:text-blue-600">{post.category}</a>
                  </Link>
                </>
              )}
              {post.readTime && (
                <>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} min read</span>
                </>
              )}
            </div>
            
            {post.author && (
              <div className="flex items-center mb-8">
                {post.authorImage ? (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={post.authorImage}
                      alt={post.author}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                    <span className="text-lg font-bold">{post.author.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{post.author}</p>
                  {post.authorTitle && <p className="text-sm text-gray-500">{post.authorTitle}</p>}
                </div>
              </div>
            )}
            
            <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                      <a className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full">
                        {tag}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {relatedPost.coverImage && (
                    <div className="relative h-48">
                      <Image
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <a className="block">
                        <h3 className="text-lg font-bold mb-2 hover:text-blue-600 transition">{relatedPost.title}</h3>
                      </a>
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(relatedPost.publishedAt || relatedPost.createdAt)}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticPaths() {
  // In a production environment, we would use an absolute URL
  // For local development, we'll use the Node.js API directly
  const { db } = require('../../lib/db');
  
  // Get all published posts
  let posts = db.getAll('blog_posts') || [];
  posts = posts.filter(post => post.published);
  
  // Get the slugs for all published posts
  const paths = posts.map(post => ({
    params: { slug: post.slug }
  }));
  
  return {
    paths,
    fallback: true // Enable fallback for posts that aren't generated at build time
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  
  // In a production environment, we would use an absolute URL
  // For local development, we'll use the Node.js API directly
  const { db } = require('../../lib/db');
  
  // Get all posts
  const posts = db.getAll('blog_posts') || [];
  
  // Find the post by slug
  const post = posts.find(p => p.slug === slug);
  
  // If post not found or not published, return 404
  if (!post || !post.published) {
    return {
      notFound: true
    };
  }
  
  // Find related posts (same category or has common tags)
  let relatedPosts = [];
  
  if (post.category) {
    // Find posts in the same category
    relatedPosts = posts.filter(p => 
      p.id !== post.id && 
      p.published && 
      p.category === post.category
    );
  }
  
  // If not enough related posts by category, try finding by tags
  if (relatedPosts.length < 2 && post.tags && post.tags.length > 0) {
    const tagRelatedPosts = posts.filter(p => 
      p.id !== post.id && 
      p.published && 
      p.tags && 
      p.tags.some(tag => post.tags.includes(tag)) &&
      !relatedPosts.some(rp => rp.id === p.id)
    );
    
    relatedPosts = [...relatedPosts, ...tagRelatedPosts];
  }
  
  // Limit to 2 related posts
  relatedPosts = relatedPosts.slice(0, 2);
  
  return {
    props: {
      post,
      relatedPosts
    },
    revalidate: 60 // Revalidate every minute
  };
}
