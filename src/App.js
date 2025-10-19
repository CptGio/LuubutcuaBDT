import {
  HeadCard,
  NameInput,
  MultipleChoice,
  Form,
  ShortText,
  Submit,
  MusicPlayer,
  Thanks,
  AboutMe,
  Letter,
  Theme,
  WarnBeforeUnload,
  ContactAuthor,
  ProgressIndicator
} from "./components/hooks";
import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import ImageUpload from "./components/hooks/ImageUpload";

function App() {
  const [show, setShow] = useState(false);
  const [available, setAvailable] = useState(true);
  const [showLetter, setShowLetter] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [aboutError, setAboutError] = useState(false);
  const [memoriesError, setMemoriesError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  
  // 🎯 SIMPLIFIED LOGIC with Web3Forms (no domain restrictions!)
  const isDevelopment = process.env.NODE_ENV === "development";
  const isLocalhost = window.location.hostname === "localhost" || 
                     window.location.hostname === "127.0.0.1";
  
  // 🚀 WEB3FORMS BENEFIT: Works everywhere! Only skip on localhost dev
  const FORCE_SEND_EMAIL = false; // Set true to always send email
  const onDevelopmentEnv = isDevelopment && isLocalhost && !FORCE_SEND_EMAIL;
  
  // 📡 Enhanced Debug logs
  console.log("🌐 Web3Forms Environment Debug:");
  console.log("- Current URL:", window.location.href);
  console.log("- Hostname:", window.location.hostname);
  console.log("- NODE_ENV:", process.env.NODE_ENV);
  console.log("- isDevelopment:", isDevelopment);
  console.log("- isLocalhost:", isLocalhost);
  console.log("- FORCE_SEND_EMAIL:", FORCE_SEND_EMAIL);
  console.log("- onDevelopmentEnv (will skip email?):", onDevelopmentEnv);
  console.log("- 📧 Web3Forms will run:", !onDevelopmentEnv ? "✅ YES" : "❌ NO");
  
  if (onDevelopmentEnv) {
    console.warn("⚠️ Web3Forms bị SKIP vì đang localhost dev mode!");
    console.warn("💡 Để test email: đổi FORCE_SEND_EMAIL = true");
  } else {
    console.log("🚀 Web3Forms SẼ CHẠY! Email sẽ được gửi khi submit.");
    console.log("🎉 Web3Forms works on DevTunnel, localhost, production - No CORS issues!");
  }

  const [data, setData] = useState({
    date: "",
    name: "",
    about: "",
    handsome: 40,
    memories: "",
    image: null,
    message: "",
  });

  const getCurrentStep = () => {
    if (!show) return 0;
    if (data.name.length < 2) return 1;
    if (data.about.length < 5) return 2;
    if (data.handsome === 40) return 3;
    if (data.memories.length < 5) return 4;
    if (!data.image) return 5;
    if (data.message.length < 5) return 6;
    return 7;
  };
  
  const localData = localStorage.getItem("data");
  useEffect(() => {
    if (localData) {
      setData(JSON.parse(localData));
      setAvailable(false);
    }
  }, [localData]);
  
  return (
    <Theme>
      {show && <ProgressIndicator currentStep={getCurrentStep()} />}

      <HeadCard 
        show={show}
        setShow={setShow}
        setData={setData}
        available={available}
        showLetter={showLetter}
        setShowLetter={setShowLetter} 
      />
      <MusicPlayer/>
      <Thanks show={show} available={available} data={data} />
      <Letter show={show} data={data} showLetter={showLetter} />
      <NameInput nameError={nameError} show={show} setData={setData} data={data} />
      <AboutMe available={available} aboutError={aboutError} show={show} setData={setData} data={data} />
      <MultipleChoice available={available} show={show} setData={setData} data={data} />
      <Form available={available} memoriesError={memoriesError} show={show} setData={setData} data={data} />
      
      <ImageUpload 
        available={available} 
        show={show} 
        setData={setData} 
        data={data} 
      />
      
      <ShortText available={available} messageError={messageError} show={show} setData={setData} data={data} />
      <Submit 
        onDevelopmentEnv={onDevelopmentEnv}
        setNameError={setNameError}
        setAboutError={setAboutError}
        setMemoriesError={setMemoriesError}
        setMessageError={setMessageError}
        show={show}
        setShow={setShow}
        setData={setData}
        data={data}
        available={available}
        setAvailable={setAvailable}
        setShowLetter={setShowLetter} 
      />
      <ContactAuthor />
      <Analytics />
      {(data.name || data.about || data.message || data.memories || data.image) && available && <WarnBeforeUnload />}
    </Theme>
  );
}

export default App;

