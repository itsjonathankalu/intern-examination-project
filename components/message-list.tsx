'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown, Copy, Check, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { isToday, isYesterday, isThisWeek, format } from 'date-fns';

// The component's internal representation of a message
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

// The structure of the data coming from the API
interface RawMessageData {
  business_id: number;
  message_text: string;
  message_date: string;
  platform: string;
  bot_sender: boolean;
}

interface GroupedMessages {
  [key: string]: Message[];
}

export function MessageList() {
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessages>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const rawData: RawMessageData[] = await response.json();

        const transformedData: Message[] = rawData.map((rawMsg, index) => ({
          id: `${rawMsg.message_date}-${index}`,
          content: rawMsg.message_text,
          role: rawMsg.bot_sender ? 'assistant' : 'user',
          createdAt: rawMsg.message_date,
        }));

        const validMessages = transformedData.filter(m => m.createdAt && !isNaN(new Date(m.createdAt).getTime()));
        
        const sortedMessages = validMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        const groups = sortedMessages.reduce((acc: GroupedMessages, message) => {
          const messageDate = new Date(message.createdAt);
          let groupKey: string;

          if (isToday(messageDate)) {
            groupKey = 'Today';
          } else if (isYesterday(messageDate)) {
            groupKey = 'Yesterday';
          } else if (isThisWeek(messageDate, { weekStartsOn: 1 /* Monday */ })) {
            groupKey = 'This Week';
          } else {
            groupKey = format(messageDate, 'MMMM d, yyyy');
          }

          if (!acc[groupKey]) {
            acc[groupKey] = [];
          }
          acc[groupKey].push(message);
          return acc;
        }, {});

        setGroupedMessages(groups);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [loading]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const isScrolledUp = scrollHeight - scrollTop > clientHeight * 1.5;
      setShowJumpToBottom(isScrolledUp);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectMessage = (messageId: string) => {
    if (selectedMessageId === messageId) {
      setSelectedMessageId(null); // Deselect if already selected
    } else {
      setSelectedMessageId(messageId);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="mr-3 h-8 w-8 animate-spin" />
        <p className="text-xl">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div ref={scrollContainerRef} className="relative">
      <div className="space-y-4">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date} className="relative">
            <div className="sticky top-0 z-10 bg-background py-2 text-center">
              <span className="px-2 py-1 text-sm font-semibold bg-muted rounded-full">{date}</span>
            </div>
            <div className="space-y-4 pt-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={clsx('flex items-center gap-2', {
                    'justify-end': message.role === 'user',
                    'justify-start': message.role === 'assistant',
                  })}
                >
                  {selectedMessageId === message.id && message.role === 'assistant' && (
                    <Button variant="ghost" size="icon" onClick={() => handleCopyMessage(message.content)}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                  <Card
                    onClick={() => handleSelectMessage(message.id)}
                    className={clsx('max-w-xs md:max-w-md cursor-pointer', {
                      'bg-primary text-primary-foreground': message.role === 'user',
                      'bg-muted': message.role === 'assistant',
                      'ring-2 ring-ring ring-offset-2 ring-offset-background': selectedMessageId === message.id,
                    })}
                  >
                    <CardContent className="p-4">
                      <p>{message.content}</p>
                      <p className="text-xs text-right mt-2 opacity-70">
                        {formatTimestamp(message.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                  {selectedMessageId === message.id && message.role === 'user' && (
                    <Button variant="ghost" size="icon" onClick={() => handleCopyMessage(message.content)}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {showJumpToBottom && (
        <Button
          onClick={scrollToBottom}
          className="fixed bottom-4 right-4 sm:bottom-10 sm:right-10 rounded-full w-12 h-12"
          variant="outline"
          size="icon"
        >
          <ArrowDown className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
