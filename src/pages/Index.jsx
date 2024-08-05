import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BEARER_TOKEN = 'YOUR_BEARER_TOKEN';

const fetchTwitterData = async (username) => {
  const response = await fetch(`https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`, {
    headers: {
      'Authorization': `Bearer ${BEARER_TOKEN}`
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
    <div className="min-h-screen p-8 bg-gray-100">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Twitter Performance Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
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
  );
};

export default Index;
