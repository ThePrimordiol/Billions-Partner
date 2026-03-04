import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minus, 
  User,
  Bot,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { API } from '@/services/api';
import { CHAT_RESPONSES, CONTACT } from '@/lib/constants';
import type { ChatMessage } from '@/types';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      const savedMessages = await API.chat.getMessages();
      if (savedMessages.length === 0) {
        // Add welcome message
        const welcomeMsg = await API.chat.sendMessage(
          "Hello! Welcome to Billion's Partner. How can I help you today?",
          'system'
        );
        setMessages([welcomeMsg]);
      } else {
        setMessages(savedMessages);
      }
    };
    loadMessages();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-open after 5 seconds on first visit
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('chatVisited');
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('chatVisited', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg = await API.chat.sendMessage(inputMessage, 'user');
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Simulate typing
    setIsTyping(true);

    // Generate response after delay
    setTimeout(async () => {
      const randomResponse = CHAT_RESPONSES[Math.floor(Math.random() * CHAT_RESPONSES.length)];
      const botMsg = await API.chat.sendMessage(randomResponse, 'system');
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isMinimized ? 'h-14' : 'h-[500px]'
      }`}
    >
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Chat Support</h3>
            <p className="text-xs text-gray-400">Typically replies in 5 min</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="h-[350px] p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
                        : msg.sender === 'system'
                        ? 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm'
                        : 'bg-green-100 text-green-800 rounded-2xl rounded-bl-sm'
                    } px-4 py-2 shadow-sm`}
                  >
                    <div className="flex items-center space-x-1 mb-1">
                      {msg.sender === 'user' ? (
                        <User className="h-3 w-3" />
                      ) : msg.sender === 'system' ? (
                        <Bot className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      <span className="text-xs opacity-75">
                        {msg.sender === 'user' ? 'You' : msg.sender === 'system' ? 'Support' : msg.senderName}
                      </span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-white border-t border-gray-100">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setInputMessage('I need an electrician')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs whitespace-nowrap transition-colors"
              >
                Need electrician
              </button>
              <button
                onClick={() => setInputMessage('Book a plumber')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs whitespace-nowrap transition-colors"
              >
                Book plumber
              </button>
              <button
                onClick={() => setInputMessage('Emergency service')}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-xs whitespace-nowrap transition-colors"
              >
                Emergency
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Or call us directly:</span>
              <a 
                href={`tel:${CONTACT.phoneRaw}`}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Phone className="h-3 w-3 mr-1" />
                {CONTACT.phone}
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
