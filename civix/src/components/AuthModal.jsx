import { useState } from 'react';
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';
import ForgotPassword from './Forgotpassword.jsx';

export default function AuthModal({
  onClose,
  showForgotPassword,
  onShowForgotPassword,
  onShowLoginTabs
}) {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        {!showForgotPassword ? (
          <>
            {/* Tabs */}
            <div className="flex justify-center mb-4">
              <button
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'login'
                    ? 'text-blue-900 border-b-2 border-blue-900'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'register'
                    ? 'text-blue-900 border-b-2 border-blue-900'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>

            {/* Forms */}
            {activeTab === 'login' ? (
              <LoginForm
                 mode="inline"
                onForgotPassword={onShowForgotPassword}
                onSwitchToRegister={() => setActiveTab('register')}
              />
            ) : (
              <RegisterForm/>

            )}
          </>
        ) : (
          <ForgotPassword onCancel={onShowLoginTabs} />
        )}
      </div>
    </div>
  );
}