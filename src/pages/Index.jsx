import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

const BEARER_TOKEN = 'YOUR_BEARER_TOKEN';

const fetchName = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/name', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch name');
  }
  return response.json();
};

const reverseString = (str) => {
  return str.split('').reverse().join('');
};

const fetchTwitterData = async (username) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`, {
    headers: {
      'Authorization': `Bearer ${BEARER_TOKEN}`,
      'X-Auth-Token': token
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch Twitter data');
  }
  return response.json();
};

const Index = () => {
  const [username, setUsername] = useState('');
  const [showData, setShowData] = useState(false);
  const [stringToReverse, setStringToReverse] = useState('');
  const [reversedString, setReversedString] = useState('');
  const [nameData, setNameData] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchName()
        .then(data => setNameData(data))
        .catch(error => {
          console.error('Error fetching name:', error);
          if (error.message === 'Failed to fetch name') {
            localStorage.removeItem('token');
            navigate('/login');
          }
        });
    }
  }, [navigate]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['twitterData', username],
    queryFn: () => fetchTwitterData(username),
    enabled: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowData(true);
    refetch();
  };

  const handleReverseString = () => {
    setReversedString(reverseString(stringToReverse));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/login');
  };

  const chartData = data ? [
    {
      metric: 'Followers',
      value: data.data.public_metrics.followers_count
    },
    {
      metric: 'Following',
      value: data.data.public_metrics.following_count
    },
    {
      metric: 'Tweets',
      value: data.data.public_metrics.tweet_count
    },
  ] : [];

  return (
    <div className="min-h-screen p-8 bg-gray-100 relative overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300 rounded-full opacity-20 blur-3xl" />
      </motion.div>
      <div className="relative z-10">
        <div className="flex justify-end mb-4">
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">String Reverser</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Enter a string to reverse"
              value={stringToReverse}
              onChange={(e) => setStringToReverse(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleReverseString}>Reverse</Button>
          </div>
          {reversedString && (
            <p className="mt-4">Reversed string: <strong>{reversedString}</strong></p>
          )}
        </CardContent>
      </Card>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Twitter Performance Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          {nameData && (
            <p className="mb-4 text-center">Welcome, {nameData.name}!</p>
          )}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter Twitter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit">Analyze</Button>
            </div>
          </form>

          {isLoading && <p>Loading...</p>}
          {isError && <p>Error fetching data. Please try again.</p>}

          {showData && data && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Performance Data for @{username}</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Index;
