import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, X, Bot, Send, User } from "lucide-react";

import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Message = {
  id: number;
  userId: number;
  message: string;
  response: string;
  createdAt: string;
};

export function EthervoxAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [isFullsize, setIsFullsize] = useState(false);
  
  // When the component mounts, check if the user has any chat history
  const { data: chatHistory = [] } = useQuery<Message[]>({
    queryKey: ['/api/ai-chat'],
    enabled: Boolean(user), // Only fetch if user is logged in
  });
  
  const mutation = useMutation<any, Error, string>({
    mutationFn: async (messageToSend: string) => {
      const res = await apiRequest("POST", "/api/ai-chat", { message: messageToSend });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-chat'] });
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to use ETHERVOX AI",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(message);
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleFullsize = () => {
    setIsFullsize(!isFullsize);
  };
  
  // If user is not logged in, don't render the component
  if (!user) return null;
  
  const renderMessage = (chat: Message) => (
    <div key={chat.id} className="mb-4">
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-950/60 to-gray-900/60 backdrop-blur-sm border border-purple-800/30 text-white">
            {chat.message}
          </div>
        </div>
      </div>
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="p-3 rounded-lg bg-gradient-to-r from-gray-900/60 to-purple-950/60 backdrop-blur-sm border border-purple-800/30 text-white">
            {chat.response}
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Chat button */}
      <Button
        onClick={toggleChat}
        className={`fixed z-50 ${
          isOpen ? "bottom-[390px] right-6" : "bottom-6 right-6"
        } rounded-full w-14 h-14 p-0 shadow-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>
      
      {/* Chat window */}
      {isOpen && (
        <Card
          className={`fixed z-40 ${
            isFullsize 
              ? "top-4 left-4 right-4 bottom-4 w-auto h-auto" 
              : "bottom-6 right-6 w-[350px] h-[380px]"
          } bg-gradient-to-br from-gray-900 to-purple-950 border-purple-700/50 flex flex-col overflow-hidden shadow-xl transition-all duration-200 ease-in-out`}
        >
          {/* Chat header */}
          <div className="p-3 border-b border-purple-800/30 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-300" />
              <h3 className="font-bold text-gray-50">ETHERVOX AI</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleFullsize}
                className="h-8 w-8 hover:bg-purple-800/20"
              >
                <Plus className="h-4 w-4 text-gray-300" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChat}
                className="h-8 w-8 hover:bg-purple-800/20"
              >
                <X className="h-4 w-4 text-gray-300" />
              </Button>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-purple-800 scrollbar-track-gray-900/30">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <Bot className="h-12 w-12 text-purple-500 mb-3" />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  Welcome to ETHERVOX AI
                </h3>
                <p className="text-gray-400 text-sm">
                  I'm your virtual assistant. Ask me anything about our services, payment methods, or referral program!
                </p>
              </div>
            ) : (
              <>
                {chatHistory.map(renderMessage)}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Chat input */}
          <div className="p-3 border-t border-purple-800/30 bg-gradient-to-r from-gray-900/90 to-purple-950/90">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask ETHERVOX AI something..."
                className="resize-none bg-gray-900/50 border-purple-700/30 text-gray-200 placeholder:text-gray-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || mutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800"
              >
                {mutation.isPending ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-30 border-t-white rounded-full" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}