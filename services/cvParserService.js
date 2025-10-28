const fs = require('fs');
const pdf = require('pdf-parse'); 
const { originalKeywords, lowerCaseKeywords } = require('../config/skillsKeywords');

const parseCvForSkills = async (filePath) => {
    try {
        console.log('[CV Parser] Sürüm 1.1.1 ile ayrıştırma işlemi başladı.');
        const dataBuffer = fs.readFileSync(filePath);
        
        const data = await pdf(dataBuffer);
        
        const cvText = data.text.toLowerCase();
        console.log('[CV Parser] PDF metni başarıyla okundu.');

        const foundSkills = new Set();

        lowerCaseKeywords.forEach((keyword, index) => {
            const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'g');

            if (regex.test(cvText)) {
                foundSkills.add(originalKeywords[index]);
            }
        });

        if (foundSkills.size > 0) {
            const skillsArray = Array.from(foundSkills);
            console.log(`[CV Parser] Bulunan yetenekler: ${skillsArray.join(', ')}`);
            return skillsArray.join(', ');
        } else {
            console.log('[CV Parser] Eşleşen yetenek bulunamadı.');
            return '';
        }

    } catch (error) {
        console.error('[CV Parser] HATA:', error);
        return '';
    }
};

module.exports = { parseCvForSkills };