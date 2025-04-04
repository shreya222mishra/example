import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveAs } from 'file-saver';

export default function RoadmapApp() {
  const [idea, setIdea] = useState('');
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer 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`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that breaks down ideas into roadmaps.' },
            { role: 'user', content: `Create a roadmap with milestones for the following project idea: ${idea}` },
          ],
        }),
      });

      const data = await response.json();
      const milestones = data.choices[0].message.content.split('\n').filter(line => line.trim() !== '');
      setRoadmap(milestones);
    } catch (error) {
      console.error('Error generating roadmap:', error);
    }
    setLoading(false);
  };

  const exportPDF = () => {
    const text = roadmap.join('\n');
    const blob = new Blob([text], { type: 'application/pdf' });
    saveAs(blob, 'roadmap.pdf');
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-start py-10">
      <h1 className="text-4xl font-bold text-rose-700 mb-6">Roadmap Maker</h1>
      <Card className="w-full max-w-md bg-pink-50 shadow-xl">
        <CardContent className="p-6 flex flex-col space-y-4">
          <Textarea
            placeholder="Enter your project idea here..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="bg-pink-100 text-rose-800"
          />
          <Button onClick={generateRoadmap} disabled={loading} className="bg-rose-400 hover:bg-rose-500 text-white">
            {loading ? 'Creating Roadmap...' : 'Create Roadmap'}
          </Button>
        </CardContent>
      </Card>

      {roadmap.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h2 className="text-2xl text-rose-600 mb-4">Milestones</h2>
          {roadmap.map((milestone, index) => (
            <Card key={index} className="mb-2 bg-rose-50 border border-rose-200">
              <CardContent className="p-4 text-rose-900">{milestone}</CardContent>
            </Card>
          ))}
          <Button onClick={exportPDF} className="mt-4 bg-rose-300 hover:bg-rose-400 text-white">
            Export as PDF
          </Button>
        </div>
      )}
    </div>
  );
}
