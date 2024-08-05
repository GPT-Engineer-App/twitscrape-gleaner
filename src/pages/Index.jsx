import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockData = [
  { date: '2023-01-01', impressions: 1000, likes: 50, retweets: 10 },
  { date: '2023-01-02', impressions: 1200, likes: 60, retweets: 15 },
  { date: '2023-01-03', impressions: 800, likes: 40, retweets: 8 },
  { date: '2023-01-04', impressions: 1500, likes: 75, retweets: 20 },
  { date: '2023-01-05', impressions: 2000, likes: 100, retweets: 30 },
];

const Index = () => {
  const [username, setUsername] = useState('');
  const [showData, setShowData] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowData(true);
  };

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

          {showData && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Performance Data for @{username}</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="impressions" stroke="#8884d8" />
                  <Line type="monotone" dataKey="likes" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="retweets" stroke="#ffc658" />
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
