import Link from 'next/link';

const blogPosts = [
  {
    id: 'cbt-techniques-anxiety',
    title: '5 Powerful CBT Techniques to Reduce Anxiety',
    excerpt: 'Learn evidence-based cognitive behavioral therapy techniques that can help you manage anxiety and worry effectively.',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'CBT Techniques',
    slug: 'cbt-techniques-anxiety'
  },
  {
    id: 'ai-therapy-benefits',
    title: 'How AI Therapy is Revolutionizing Mental Health Care',
    excerpt: 'Discover the benefits of AI-powered therapy and how it complements traditional mental health treatment.',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'AI Therapy',
    slug: 'ai-therapy-benefits'
  },
  {
    id: 'depression-self-help',
    title: 'Self-Help Strategies for Depression: A Complete Guide',
    excerpt: 'Practical strategies and techniques to help you manage depression symptoms and improve your mood.',
    date: '2024-01-05',
    readTime: '8 min read',
    category: 'Depression',
    slug: 'depression-self-help'
  },
  {
    id: 'mindfulness-meditation',
    title: 'Mindfulness Meditation for Beginners: Start Your Practice',
    excerpt: 'A beginner-friendly guide to mindfulness meditation and its benefits for mental health and stress reduction.',
    date: '2024-01-01',
    readTime: '6 min read',
    category: 'Mindfulness',
    slug: 'mindfulness-meditation'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mental Health Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert insights on mental wellness, CBT techniques, and AI therapy to help you on your mental health journey.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm ml-auto">{post.readTime}</span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <time className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Mental Wellness Journey?
            </h2>
            <p className="text-gray-600 mb-6">
              Get personalized AI wellness guidance and CBT-based coaching with 20 free messages.
            </p>
            <Link 
              href="/"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 