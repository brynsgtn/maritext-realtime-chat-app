

const TypingIndicator = ({ isTyping, userName }) => {
    if (!isTyping) return null;

    return (
        <div className="chat chat-start">
            <div className="chat-bubble">
                <div className="flex items-center space-x-2">
                    <span className="text-sm italic">
                        {userName} is typing
                    </span>
                    <div className="flex space-x-1">
                        <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
                        ></div>
                        <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '160ms', animationDuration: '1.4s' }}
                        ></div>
                        <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '320ms', animationDuration: '1.4s' }}
                        ></div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;