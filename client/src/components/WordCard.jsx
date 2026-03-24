import React from 'react';
import pinyinUtils from 'pinyin-utils'; // เรียกใช้ที่เราเพิ่งติดตั้ง

const WordCard = ({ word, pinyin, meaning, onAIExplain }) => {

    // ฟังก์ชันแปลงพินอินจาก ni3 hao3 เป็น nǐ hǎo
    const formatPinyin = (rawPinyin) => {
        if (!rawPinyin) return "";

        const clean = rawPinyin.replace(/[\[\]]/g, '');
        try {
            return pinyinUtils.numberToMark(clean);
        } catch (err) {
            return clean; 
        }
    };

    return (
        <div className="word-card" style={styles.card}>
            <div className="word-header">
                <h2 style={styles.chinese}>{word}</h2>
                <span style={styles.pinyin}>{formatPinyin(pinyin)}</span>
            </div>

            <p style={styles.meaning}>{meaning}</p>

            {/* ปุ่มสำหรับเรียกใช้ AI ใน Home.jsx */}
            <button
                onClick={() => onAIExplain({ word, pinyin, meaning })}
                style={styles.aiButton}
            >
                🤖 AI อธิบายบริบทการใช้งาน
            </button>
        </div>
    );
};

const styles = {
    card: {
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '20px',
        margin: '10px 0',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    chinese: {
        fontSize: '2rem',
        margin: '0 0 5px 0',
        color: '#333'
    },
    pinyin: {
        fontSize: '1.2rem',
        color: '#e67e22',
        fontWeight: 'bold'
    },
    meaning: {
        fontSize: '1rem',
        color: '#666',
        margin: '15px 0'
    },
    aiButton: {
        backgroundColor: '#34495e',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        width: '100%'
    }
};

export default WordCard;