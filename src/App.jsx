import React from "react";
import PetitionForm from "./components/PetitionForm.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <header className="brand">Civix</header>

      <main>
        <h2 className="page-title">Create a New Petition</h2>
        <p className="page-sub">
          Complete the form below to create a petition in your community.
        </p>

        <PetitionForm />
      </main>
    </div>
  );
}