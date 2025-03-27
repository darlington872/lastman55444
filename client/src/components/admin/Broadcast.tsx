import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const Broadcast: React.FC = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBroadcast = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and message for the broadcast.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/admin/broadcast", { title, message });
      
      toast({
        title: "Broadcast Sent",
        description: "Your message has been broadcast to all users successfully.",
      });
      
      // Reset form
      setTitle("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Broadcast Failed",
        description: error instanceof Error ? error.message : "An error occurred while sending the broadcast.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Broadcast Message</CardTitle>
        <CardDescription>
          Send a message to all users on the platform. This is useful for announcements, updates, or important information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Message Title</Label>
            <Input
              id="title"
              placeholder="E.g., System Update, New Features, Important Notice"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message Content</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={handleBroadcast} 
              disabled={isSubmitting || !title.trim() || !message.trim()}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Sending..." : "Send Broadcast"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Broadcast;
