import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaUser, FaEnvelope, FaPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { getConversations, getMessages, sendMessage, markMessagesAsRead } from '../api/apiService';
import { useLocation } from 'react-router-dom';

const Messages = () => {
  const { user, refreshUnreadCount } = useAuth(); // ✅ ADD REFRESHUNREADCOUNT
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // ✅ GET RECIPIENT DATA FROM SEARCH PAGE
  const recipientData = location.state || null;

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.other_user_id);
      // ✅ MARK MESSAGES AS READ WHEN CONVERSATION IS SELECTED
      markMessagesAsRead(user.user_id, selectedConversation.other_user_id)
        .then(() => {
          // ✅ REFRESH UNREAD COUNT IN HEADER
          if (refreshUnreadCount) {
            refreshUnreadCount();
          }
        })
        .catch(error => {
          console.error('Failed to mark messages as read:', error);
        });
    }
  }, [selectedConversation]);

  // ✅ HANDLE RECIPIENT DATA FROM SEARCH RESULTS
  useEffect(() => {
    if (recipientData && recipientData.recipientId && user) {
      // Check if conversation already exists
      const existingConv = conversations.find(
        conv => conv.other_user_id === recipientData.recipientId
      );
      
      if (existingConv) {
        setSelectedConversation(existingConv);
      } else {
        // Create a new conversation object
        const newConversation = {
          other_user_id: recipientData.recipientId,
          other_user_name: recipientData.recipientName || 'Unknown User',
          last_message: 'Start a new conversation...',
          last_message_time: new Date().toISOString(),
          unread_count: 0
        };
        
        // Add to conversations list and select it
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
        setMessages([]); // Clear messages for new conversation
      }
    }
  }, [recipientData, conversations, user]);

  const loadConversations = async () => {
    try {
      const response = await getConversations(user.user_id);
      if (response.success) {
        setConversations(response.conversations);
        
        // ✅ AUTO-SELECT CONVERSATION IF COMING FROM SEARCH
        if (recipientData && recipientData.recipientId) {
          const targetConv = response.conversations.find(
            conv => conv.other_user_id === recipientData.recipientId
          );
          if (targetConv) {
            setSelectedConversation(targetConv);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId) => {
    try {
      const response = await getMessages(user.user_id, otherUserId);
      if (response.success) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const response = await sendMessage(
        user.user_id, 
        selectedConversation.other_user_id, 
        newMessage.trim()
      );
      
      if (response.success) {
        setNewMessage('');
        // Reload messages to show the new message
        await loadMessages(selectedConversation.other_user_id);
        // Reload conversations to update last message
        await loadConversations();
        
        // ✅ REFRESH UNREAD COUNT AFTER SENDING MESSAGE
        if (refreshUnreadCount) {
          setTimeout(() => {
            refreshUnreadCount();
          }, 1000);
        }
      } else {
        alert('Failed to send message: ' + response.error);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // ✅ START NEW CONVERSATION FUNCTION
  const startNewConversation = () => {
    if (recipientData && recipientData.recipientId) {
      const newConversation = {
        other_user_id: recipientData.recipientId,
        other_user_name: recipientData.recipientName || 'Unknown User',
        last_message: 'Start a new conversation...',
        last_message_time: new Date().toISOString(),
        unread_count: 0
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
      setMessages([]);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Please log in to view your messages.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 200px)', maxWidth: '1200px', margin: '0 auto', padding: '2rem', gap: '1rem' }}>
      {/* Conversations Sidebar */}
      <div style={{ flex: '0 0 300px', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', backgroundColor: '#f8f9fa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: '#2c5aa0' }}>Messages</h3>
          {/* ✅ SHOW NEW CONVERSATION BUTTON WHEN COMING FROM SEARCH */}
          {recipientData && !conversations.find(c => c.other_user_id === recipientData.recipientId) && (
            <button
              onClick={startNewConversation}
              style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <FaPlus size={12} />
              New Chat
            </button>
          )}
        </div>

        {loading ? (
          <p>Loading conversations...</p>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            <FaEnvelope size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No conversations yet</p>
            <p>Start chatting with sellers about their books!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {conversations.map((conv) => (
              <div
                key={conv.other_user_id}
                onClick={() => setSelectedConversation(conv)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: selectedConversation?.other_user_id === conv.other_user_id ? '#e3f2fd' : 'white',
                  border: selectedConversation?.other_user_id === conv.other_user_id ? '1px solid #2196f3' : '1px solid #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaUser style={{ color: '#666' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    {conv.other_user_name}
                    {conv.unread_count > 0 && (
                      <span style={{
                        backgroundColor: '#ff5722',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '0.1rem 0.4rem',
                        fontSize: '0.7rem',
                        marginLeft: '0.5rem'
                      }}>
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.last_message}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.25rem' }}>
                    {formatTime(conv.last_message_time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
        {selectedConversation ? (
          <>
            {/* Message Header */}
            <div style={{ padding: '1rem', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
              <h4 style={{ margin: 0, color: '#2c5aa0' }}>
                Chat with {selectedConversation.other_user_name}
                {!messages.length && <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '1rem' }}>• New conversation</span>}
              </h4>
            </div>

            {/* Messages List */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  <FaEnvelope size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>No messages yet</p>
                  <p>Start the conversation about their book!</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
                    Try asking: "Is this book still available?" or "Can we meet on campus?"
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.message_id}
                    style={{
                      alignSelf: msg.sender_id === user.user_id ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: msg.sender_id === user.user_id ? '#007bff' : '#f1f1f1',
                      color: msg.sender_id === user.user_id ? 'white' : 'black',
                      wordWrap: 'break-word'
                    }}
                  >
                    <div>{msg.message_text}</div>
                    <div style={{
                      fontSize: '0.7rem',
                      opacity: 0.7,
                      marginTop: '0.25rem',
                      textAlign: msg.sender_id === user.user_id ? 'right' : 'left'
                    }}>
                      {formatTime(msg.created_at)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid #ddd', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: (newMessage.trim() && !sending) ? '#007bff' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (newMessage.trim() && !sending) ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {sending ? '...' : <FaPaperPlane />}
                {sending ? 'Sending' : 'Send'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
            <div style={{ textAlign: 'center' }}>
              <FaEnvelope size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h4>
                {recipientData ? `Start chatting with ${recipientData.recipientName}` : 'Select a conversation'}
              </h4>
              <p>
                {recipientData 
                  ? 'Click "New Chat" in the sidebar to start messaging about their book!' 
                  : 'Choose someone from the list to view your chat history'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;