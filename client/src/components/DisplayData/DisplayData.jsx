// import { useState} from 'react';
import  {parseChatFile}  from '../Parser/ParseChat.jsx';
import blacklist from '../Parser/BlackList.jsx';
import styles from './DisplayData.module.css';
import PropTypes from 'prop-types';
import file from '../Parser/ExampleChat.txt';




const DisplayData = ({fileContent}) => {
    console.log(fileContent);

    const messages = parseChatFile(file, blacklist);
   
  // Function to get background color based on severity score
  const getSeverityColor = (score) => {
    // Normalize score to be between 1-5
    const normalizedScore = ((score - 1) % 5) + 1;
    
    switch(normalizedScore) {
        case 1:
            return '#ffcccc'; // Red background
        case 2:
            return '#ffe5cc'; // Orange background
        case 3:
            return '#fff2cc'; // Yellow background
        case 4:
            return '#e5f2cc'; // Light green background
        case 5:
            return '#ccffcc'; // Green background
        default:
            return '#ffffff'; // White background as fallback
    }
};



if (!messages){return null}
    // Calculate analytics
    const totalProblematicWords = messages.reduce((total, msg) => total + msg.problematicWords.length, 0);
    
    const userViolations = messages.reduce((acc, msg) => {
        if (msg.problematicWords.length > 0) {
            acc[msg.author] = (acc[msg.author] || 0) + msg.problematicWords.length;
        }
        return acc;
    }, {});

    const mostProblematicUser = Object.entries(userViolations)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    const categoryCount = messages.reduce((acc, msg) => {
        if (msg.categories) {
            msg.categories.forEach(category => {
                acc[category] = (acc[category] || 0) + 1;
            });
        }
        return acc;
    }, {});

    return (

        <div className={styles.container}>
            <div className={styles.filterSection}>
                {/* Summary Statistics */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Chat Analysis Summary</h2>
                    </div>
                    <div className={styles.cardContent}>
                        <div className={styles.statsGrid}>
                            <div className={styles.statBox}>
                                <h3 className={styles.statTitle}>Total Problematic Words</h3>
                                <p className={styles.statValue}>{totalProblematicWords}</p>
                            </div>
                            <div className={styles.statBox}>
                                <h3 className={styles.statTitle}>Most Problematic User</h3>
                                <p className={styles.statValue}>{mostProblematicUser}</p>
                            </div>
                            <div className={styles.statBox}>
                                <h3 className={styles.statTitle}>Categories Found</h3>
                                <ul className={styles.categoryList}>
                                    {Object.entries(categoryCount).map(([category, count]) => (
                                        <li key={category}>{category}: {count}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message List */}
                <div className={styles.messageList}>
                    {messages.map((message) => (
                        <div 
                            key={message.id} 
                            className={`${styles.messageCard} ${
                                message.problematicWords.length > 0 ? styles.problematicMessage : ''
                            }`}
                        >
                            <div className={styles.messageHeader}>
                                <h3 className={styles.messageAuthor}>{message.author}
                                </h3>
                                <span className={styles.severityScore}
                
                                        style={{
                                            backgroundColor: getSeverityColor(message.score),
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            marginLeft: '8px'
                                        }}>
                                    
                                        Severity Score: {((message.score - 1) % 5) + 1}
                                    </span>
                                {message.categories && (
                                    <div className={styles.categoryTags}>
                                        {message.categories.map(category => (
                                            <span key={category} className={styles.categoryTag}>
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className={styles.messageContent}>{message.aiAnalyze}</span>
                            <p className={styles.messageContent}>{message.content}</p>
                            {message.problematicWords.length > 0 && (
                                <div className={styles.problematicWordsBox}>
                                    <p className={styles.problematicWordsText}>
                                        Problematic words found: {message.problematicWords.join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

DisplayData.propTypes = {
    fileContent: PropTypes.any
}

export default DisplayData;