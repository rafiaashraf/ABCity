
# ABCity- Alphabet Learning Application for children

This Application is meant to help children learn and practice letters.
This application shows letters corresponding to images, and using neural networks, we can predict what letter is drawn by the user.

## Prediction and Recognition

The application uses Neural Networks to predict and recognise the letter the user draws. The code for the same can be found in this file.

```
src/components/Recognition/letterRecognition.js
```

## Features
This application has the following features.

#### Child Console
Children have the following features and options to work with

- Intro to interface -  Used IntoJs to provide a walkthrough so the user knows what each button does.
- Speaking feature - The user can use the speak function to hear the letter. For example, you can hear A for Apple.
- Images corresponding to the letter.
- Input Canvas for allowing users to draw letters.
- Color and brush size selectors.
- Speech-enabled selection - Users can enable speech recognition to verbally select letters.


#### Recognition
- Neural networks were used to predict the top 10 predictions of the letters.
- We check if the letter displayed is the same as the top letter predicted.

## Run Locally
To run the application, use the following commands.

```bash
//backend
cd backend
npm i
npm start

//frontend
npm i
npm run dev


```



