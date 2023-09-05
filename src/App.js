import React, { useState, useEffect , useRef } from 'react';
import { Paper, Typography, TextField, Button, List, ListItem, Container, ArrowBack , Grid} from '@mui/material';
import axios from 'axios';
import ChatMessage from './components/ChatMessage';


function ChatBotApp() {
  const [questions] = useState([
    //'How are you feeling today?',
    //'What is your favorite color?',
    //'Tell me about your day.',
    "Are you feeling happy or sad. How often u feel so?",
"What do you think about your future?"
//"Do you feel like a failure?",
//"How satisfied are you with things you used to enjoy?",
//"How often do you feel guilty?"
//,"Do you feel like you're being punished?"
,"How do you feel about yourself?"
//,"Do you blame yourself for things?"
//,"Do you have thoughts of killing yourself?"
//,"How often do you cry?"
,"How are you behaving with others usually nowadays?"
//,"Have you lost interest in other people?"
,"How well can you make decisions?"
,"What do you feel about your appearance?"
//,"How well can you work compared to before?"
//,"How well are you sleeping?"
//,"Do you feel more tired than usual?"
//,"How's your appetite compared to usual?"
//,"Have you lost weight recently?"
,"How worried are you about anything in last few days?"
//,"Have you lost interest in sex?"
    // Add more questions here
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messageHistory, setMessageHistory] = useState([]);
  const [averageSentiment, setAverageSentiment] = useState('');
  const [userInput, setUserInput] = useState('');
  const [positiveSentiments, setPositiveSentiments] = useState([]);
  const [negativeSentiments, setNegativeSentiments] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const chatContainerRef = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const updatedMessageHistory = messageHistory.slice(); 
    if (currentQuestionIndex < questions.length) {
      updatedMessageHistory.push({
        message: questions[currentQuestionIndex],
        isUser: false,
      });
    }
    setMessageHistory(updatedMessageHistory);
  }, [currentQuestionIndex]);

  const handleUserResponse = async () => {
    try {
      console.log(userInput); 
      setMessageHistory((prevHistory) => [
        ...prevHistory,
        { message: userInput, isUser: true },
      ]);
      const sentiment = await fetchSentiment(userInput);
      console.log(sentiment);
      const sentimentValue = sentiment[0];
      setUserResponses((prevResponses) => [...prevResponses, { message: userInput, isUser: true }]);
      if (sentimentValue === 'POSITIVE') {
        setPositiveSentiments((prev) => [...prev, sentiment[1]]);
      } else {
        setNegativeSentiments((prev) => [...prev, sentiment[1]]);
      }

      if (currentQuestionIndex <= questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        calculateAverageSentiments();
      } else {
        calculateAverageSentiments();
      }
      setUserInput('');
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
    if (currentQuestionIndex === questions.length) {
      try {
        
        await axios.post('https://chatu-rf63-git-master-swapnendu003.vercel.app/api/calls/makeCall', {
          phoneNumber: phoneNumber,
          
        });

        console.log('SMS sent successfully');
      } catch (error) {
        console.error('Error sending SMS:', error);
      }
    }
  };

  const fetchSentiment = async (text) => {
    const response = await fetch('https://chatu-rf63-git-master-swapnendu003.vercel.app/api/sentiment/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: [text] }),
    });
    const data = await response.json();
    return data.sentiments;
  };

  const calculateAverageSentiments = () => {
    const positiveAverage = calculateAverage(positiveSentiments);
    const negativeAverage = calculateAverage(negativeSentiments);

    const suggestion =
      positiveAverage >= negativeAverage ? 'positive' : 'negative';
    console.log(suggestion);
    setAverageSentiment(suggestion);
  };

  const calculateAverage = (values) => {
    if (values.length === 0) {
      return 0;
    }
    const total = values.reduce((sum, value) => sum + value, 0);
    return total / values.length;
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleUserResponse();
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '40px' }}>
  <Paper elevation={3} style={{ margin:'20px',padding: '20px', height: '100vh', overflowY: 'auto' }}>
    
    <Grid container justifyContent="space-between" alignItems="center" marginBottom="20px">
      <Typography variant="h4" align="center">
        MedAid Disha
      </Typography>
      {currentQuestionIndex === questions.length && (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => window.location.reload()} 
        >
          Go to Home
        </Button>
      )}
    </Grid>

    
    <List sx={{ overflowY: 'auto', maxHeight: '60vh', marginBottom: '15px', borderRadius: '10px', padding: '10px', backgroundColor: '#f4f4f4' }}>
      {messageHistory.map((messageData, index) => (
        <ListItem
          key={index}
          sx={{
            marginBottom: '10px',
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            justifyContent: messageData.isUser ? 'flex-end' : 'flex-start',
          }}
        >
          <ChatMessage message={messageData.message} isUser={messageData.isUser} />
        </ListItem>
      ))}
    </List>

    
    {currentQuestionIndex < questions.length && (
      <div>
        <TextField
          label="Type your answer..."
          variant="outlined"
          fullWidth
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ marginTop: '10px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUserResponse}
          sx={{ marginTop: '10px' }}
        >
          Submit
        </Button>
      </div>
    )}

  
    {currentQuestionIndex === questions.length && (
      <div>
        <Typography variant="h6">MedAid Disha</Typography>
        <Typography variant="body1">Thank you for answering the questions.</Typography>

        <Typography variant="body1">Preliminary Result Analyzed: {averageSentiment=='positive'?"As per Analysis it seems like your are good state of mind. Be happy , be cheerful. However if you want , you can still contact any psychologist.":"As per analysis it seems like, you might need a professional pysochologist to sort out what you are going through. A psychologist will give you a better advice."}</Typography>
      </div>
    )}
    </Paper>
    
    <Paper elevation={3} style={{margin:'20px', padding: '20px', height: '35vh', overflowY: 'auto' }}>
    
    {currentQuestionIndex === questions.length && (
        <div>
           <Typography variant="h6">Want to Take Professional Help?</Typography>
        <Typography variant="body1">Help us by providing your Phone number and We will reach to you. Be free to talk and sort out all your quiries from our Psychologists at MedAid.</Typography>
          <TextField
            label="Enter your phone number"
            variant="outlined"
            fullWidth
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            sx={{ marginTop: '10px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUserResponse}
            sx={{ marginTop: '10px' }}
          >
            Submit Phone Number
          </Button>
        </div>
      )}
  </Paper>
</Container>
  );
}

export default ChatBotApp;
