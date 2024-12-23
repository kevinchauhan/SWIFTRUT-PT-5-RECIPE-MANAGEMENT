import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [posts, setPosts] = useState([]);

    // Fetch all posts from the backend
    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/posts`);
            const data = await response.json();
            setPosts(data);
        };
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (confirmDelete) {
            await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/posts/${id}`, { method: 'DELETE' }); // Backend route for deletion
            setPosts(posts.filter((post) => post._id !== id)); // Update the list locally
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">All Blog Posts</h2>
            <div className="grid gap-4">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="p-4 border border-gray-300 rounded-md shadow-sm hover:shadow-lg">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <h3 className="text-lg font-bold">{post.title}</h3>
                            <p className="text-sm text-gray-500">By {post.author} on {new Date(post.date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500 mt-1">Tags: {post.tags.join(', ')}</p>
                            <p className="text-gray-700 mt-2">
                                {post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content}
                            </p>
                            <div className="flex justify-between items-center mt-4">
                                <Link to={`/post/${post._id}`} className="text-indigo-600 hover:underline">Read More</Link>
                                <div className="flex space-x-4">
                                    <Link to={`/post-form/${post._id}`} className="text-blue-600 hover:underline">Edit</Link>
                                    <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:underline">Delete</button>
                                </div>
                            </div>
                        </div>

                    ))
                ) : (
                    <p>No blog posts found.</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
