require('dotenv').config();
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pinyinUtils = require('pinyin-utils');
const { setGlobalDispatcher, ProxyAgent } = require('undici'); // ใช้แค่ undici พอครับ

// 1. ตั้งค่า Proxy ให้ Node.js ทั้งระบบ (เปลี่ยนเลขพอร์ตตาม VPN ของคุณ เช่น 7890 หรือ 1080)
const proxyAgent = new ProxyAgent('http://127.0.0.1:7890');
setGlobalDispatcher(proxyAgent);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/explain', async (req, res) => {
    const { word, pinyin, meaning_th } = req.body;
    console.log("ข้อมูลที่ได้รับ:", req.body);

    try {
        const cleanPinyin = pinyin.replace(/[\[\]]/g, '').replace(/([a-z]+)\s+([1-5])/gi, '$1$2');
        const formattedPinyin = pinyinUtils.numberToMark(cleanPinyin);

        // 2. เรียก Model ตามปกติ (ไม่ต้องใส่ requestOptions แล้วเพราะเราเซ็ต Global ไว้ด้านบน)
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash', 
        });

        const prompt = `คำจีน: ${word} (${formattedPinyin})
ความหมายพื้นฐาน: ${meaning_th}

อธิบายเป็นภาษาไทยแบบละเอียด:
1. บริบทการใช้งาน (ใช้ในสถานการณ์ไหน ทางการหรือไม่)
2. ตัวอย่างประโยค 2 ประโยค (ตัวจีน พินอินสัญลักษณ์ และคำแปลไทย)
3. คำศัพท์ที่เกี่ยวข้องหรือใช้แทนกันได้`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({
            explanation: text,
            formattedPinyin: formattedPinyin
        });

    } catch (error) {
        console.error('--- AI ERROR DETAIL ---');
        console.error(error);
        res.status(500).json({ message: 'AI error', error: error.message });
    }
});

module.exports = router;