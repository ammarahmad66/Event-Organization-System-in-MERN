import React, { useState } from "react";
import { styled } from "@mui/system";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";
import { useEffect } from "react";
const MainContainer = styled(Box)({
  display: "flex",
  height: "90vh",
});

const ClientListContainer = styled(Box)({
  width: "25%",
  borderRight: "1px solid rgba(0, 0, 0, 0.1)",
  overflowY: "auto",
});

const ChatContainer = styled(Box)({
  width: "75%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

const MessagesContainer = styled(Box)({
  flexGrow: 1,
  overflowY: "auto",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
});

const Message = ({ isUser, children }) => {
  return (
    <Box
      sx={{
        maxWidth: "60%",
        borderRadius: "12px",
        padding: "8px 12px",
        marginBottom: "8px",
        alignSelf: isUser ? "flex-end" : "flex-start",
        backgroundColor: isUser ? "primary.main" : "grey.200",
        color: isUser ? "primary.contrastText" : "text.primary",
      }}
    >
      {children}
    </Box>
  );
};

const MessageInputContainer = styled(Box)({
  display: "flex",
  padding: "16px",
});

const MessageInput = styled(TextField)({
  flexGrow: 1,
  marginRight: "8px",
});

const WhatsApp = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [vendorInfo, setVendorInfo] = useState(
    JSON.parse(localStorage.getItem("vendorInfo"))
  );
  const [message, setMessage] = useState("");
  const [allData, setallData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentClient, setCurrentClient] = useState(null);
  const getConversation = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/messages/vendor/${vendorInfo._id}/t`
    );
    setallData(data);
  };

  // useEffect(() => {
  //   getConversation();
  // }, [1]);
  getConversation();

  const handleSendMessage = async () => {
    if (message) {
      setMessages([...messages, { content: message, isUser: true }]);
      //setMessage("");
      await axios.post("http://localhost:5000/api/messages/send", {
        message: message,
        sender: vendorInfo._id,
        receiver: currentClient,
      });
      setMessage("");
      getConversation();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleClientSelect = (clientId, clientNo) => {
    setSelectedClient(clientNo + 1);
    setCurrentClient(clientId);
  };

  return (
    <MainContainer>
      <ClientListContainer>
        <List>
          {console.log("")}
          {allData.map((client, index) => (
            <ListItem disablePadding key={client.client}>
              <ListItemButton
                selected={selectedClient === index + 1}
                onClick={() => handleClientSelect(client.client, index)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={client.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ClientListContainer>
      <ChatContainer>
        <MessagesContainer>
          {selectedClient &&
            allData[selectedClient - 1].messages.map((msg, index) => (
              <Message isUser={msg.isUser} key={index}>
                <Typography variant="body1">{msg.message}</Typography>
              </Message>
            ))}
        </MessagesContainer>
        <MessageInputContainer>
          <MessageInput
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            rows={1}
            //rowsMax={4}
          />
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </MessageInputContainer>
      </ChatContainer>
    </MainContainer>
  );
};

export default WhatsApp;
