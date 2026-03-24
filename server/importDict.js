const fs = require('fs')
const db = require('./db')


async function importCEDICT() {
  const content = fs.readFileSync('./cedict_1_0_ts_utf-8_mdbg.txt', 'utf8')
  const lines = content.split('\n')

  let count = 0

  for (let line of lines) {
    line = line.replace(/\r/g, '')  // ← แก้ตรงนี้ ตัด \r ออก

    if (line.startsWith('#') || line.startsWith('%') || !line.trim()) continue

    const match = line.match(/^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/$/)
    if (!match) continue

    const simplified = match[2]
    const pinyin = match[3]
    const meaning = match[4].split('/').join(', ')

    try {
      await db.query(
        'INSERT IGNORE INTO dictionary (word, pinyin, meaning) VALUES (?, ?, ?)',
        [simplified, pinyin, meaning]
      )
      count++
      if (count % 1000 === 0) console.log(`Imported ${count} words...`)
    } catch (err) {
      // ข้ามถ้า error
    }
  }

  console.log(`Done! Total: ${count} words`)
  process.exit()
}

importCEDICT()