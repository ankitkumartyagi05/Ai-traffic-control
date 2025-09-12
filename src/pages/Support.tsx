import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MessageCircle,
  Phone,
  Mail,
  Send,
  Bot,
  User,
  HelpCircle,
  Star,
  Zap,
  Shield,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  message: string;
  timestamp: Date;
}

const Support = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      message: "Hello! 👋 I'm your AI Traffic Assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const faqItems = [
    {
      question: "How do I register a new trip?",
      answer: "To register a trip, go to the 'Register Trip' page, fill in your origin, destination, vehicle type, and travel date. You'll receive a unique Trip ID and can download your travel permit."
    },
    {
      question: "How accurate is the traffic prediction?",
      answer: "Our AI system provides 98.5% accuracy in traffic predictions using real-time data, historical patterns, and machine learning algorithms."
    },
    {
      question: "What should I do in case of emergency?",
      answer: "Use the Emergency SOS button available on multiple pages. It will instantly alert emergency services, share your location, and notify your emergency contacts."
    },
    {
      question: "How do I earn eco-rewards points?",
      answer: "You earn points by choosing eco-friendly routes, using public transport, carpooling, and following fuel-efficient driving suggestions."
    },
    {
      question: "Can I track public transport in real-time?",
      answer: "Yes! Our system tracks buses and trains in over 150 cities with real-time location updates and delay notifications."
    }
  ];

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user", 
      message: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        message: getBotResponse(currentMessage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes("route") || msg.includes("direction")) {
      return "I can help you find the best route! Use our Route Finder to get AI-powered suggestions with real-time traffic analysis. Would you like me to guide you through it?";
    } else if (msg.includes("emergency") || msg.includes("sos")) {
      return "For emergencies, use the red SOS button available throughout the app. It instantly alerts authorities and shares your location. For non-emergencies, I can help resolve your queries.";
    } else if (msg.includes("traffic") || msg.includes("congestion")) {
      return "Check our Live Traffic Monitoring page for real-time updates. I can also provide current traffic status for specific routes if you share your location.";
    } else if (msg.includes("trip") || msg.includes("permit")) {
      return "To register a trip, visit the Register Trip page. You'll get an official permit and Trip ID for tracking. Need help with a specific step?";
    } else {
      return "Thanks for your question! I can help with route planning, trip registration, traffic updates, emergency assistance, and eco-rewards. What would you like to know more about?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Support Center</h1>
          <p className="text-xl text-muted-foreground">
            Get instant help with our AI assistant or browse FAQs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Chatbot */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5 text-primary" />
                  AI Traffic Assistant
                  <Badge className="ml-2 bg-status-success text-white">Online</Badge>
                </CardTitle>
                <CardDescription>
                  24/7 intelligent support for all your traffic queries
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-[400px]">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start space-x-3 ${
                        msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        msg.type === "bot" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                      }`}>
                        {msg.type === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>
                      <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        msg.type === "user" 
                          ? "bg-primary text-primary-foreground ml-auto" 
                          : "bg-muted"
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-start space-x-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg px-4 py-2 bg-muted">
                        <p className="text-sm">AI is typing...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask me anything about traffic, routes, or features..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!currentMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Options & FAQ */}
          <div className="space-y-6">
            {/* Quick Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Quick Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  Call: 1-800-TRAFFIC
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Email: support@aitraffic.com
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Live Chat
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Zap className="mr-2 h-4 w-4 text-status-success" />
                    Traffic API
                  </span>
                  <Badge className="bg-status-success text-white">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-status-success" />
                    Emergency Services
                  </span>
                  <Badge className="bg-status-success text-white">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-status-success" />
                    Response Time
                  </span>
                  <Badge variant="secondary">&lt; 2s</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card>
              <CardHeader>
                <CardTitle>Rate Our Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-6 w-6 fill-primary text-primary cursor-pointer"
                    />
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;