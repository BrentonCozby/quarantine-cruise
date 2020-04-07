const excelToJson = require('convert-excel-to-json')
const fs = require('fs')
const {resolve} = require('path')
const crypto = require('crypto')
const {set, getYear, getDate, getMonth, add} = require('date-fns')

const timeZoneOffset = 1
const totalData = excelToJson({sourceFile: 'public/data/COVID 19 Activities & Live Events.xlsx'})

const fieldNameMapWithDates = {
  A: 'time',
  B: 'activity',
  C: 'host',
  D: 'details',
  E: 'kidFriendly',
  F: 'link'
}

const fieldNameMapAnytime = {
  A: 'category',
  B: 'activity',
  C: 'host',
  D: 'details',
  E: 'kidFriendly',
  F: 'link'
}

const educationData = parseSheet({
  sheet: totalData['EDUCATION'],
  fieldNameMap: fieldNameMapWithDates,
  category: 'education',
  hasDateRows: true
})
const fitnessAndWellnessData = parseSheet({
  sheet: totalData['FITNESS & WELLNESS'],
  fieldNameMap: fieldNameMapWithDates,
  category: 'fitnessAndWellness',
  hasDateRows: true
})
const artAndMusicData = parseSheet({
  sheet: totalData['ART & MUSIC'],
  fieldNameMap: fieldNameMapWithDates,
  category: 'artAndMusic',
  hasDateRows: true
})
const professionalDevelopmentData = parseSheet({
  sheet: totalData['PROFESSIONAL DEVELOPMENT'],
  fieldNameMap: fieldNameMapWithDates,
  category: 'professionalDevelopment',
  hasDateRows: true
})
const otherData = parseSheet({
  sheet: totalData['OTHER'],
  fieldNameMap: fieldNameMapWithDates,
  category: 'other',
  hasDateRows: true
})
const anytimeData = parseSheet({
  sheet: totalData['ANYTIME ACTIVITIES'],
  fieldNameMap: fieldNameMapAnytime
})

createJsonFile({filename: 'educationData.json', jsonData: educationData})
createJsonFile({filename: 'fitnessAndWellnessData.json', jsonData: fitnessAndWellnessData})
createJsonFile({filename: 'artAndMusicData.json', jsonData: artAndMusicData})
createJsonFile({filename: 'professionalDevelopmentData.json', jsonData: professionalDevelopmentData})
createJsonFile({filename: 'otherData.json', jsonData: otherData})
createJsonFile({filename: 'anytimeData.json', jsonData: anytimeData})

function parseSheet({sheet, fieldNameMap, category, hasDateRows}) {
  const results = []

  let tempDate = null
  sheet.slice(1).forEach(row => {
    const firstCell = row.A

    if (hasDateRows && Object.values(row).length === 1 && isValidDate(firstCell)) {
      tempDate = firstCell
      return
    }

    const parsedRow = {}

    Object.entries(row).forEach(([columnLetter, value]) => {
      const fieldName = fieldNameMap[columnLetter]

      parsedRow[fieldName] = value
    })

    if (hasDateRows && isValidDate(parsedRow.time)) {
      const date = new Date(tempDate)
      parsedRow.datetime = set(
        add(new Date(parsedRow.time), {hours: timeZoneOffset}),
        {year: getYear(date), month: getMonth(date), date: getDate(date)}
      )
      delete parsedRow.time
    }

    parsedRow.kidFriendly = String(parsedRow.kidFriendly).toLowerCase() === 'yes'
    parsedRow.category = parsedRow.category || category
    parsedRow.id = hashWithMd5(parsedRow)

    results.push(parsedRow)
  })

  return results
}

function createJsonFile({filename, jsonData}) {
  fs.writeFile(resolve(__dirname, '..', 'public', 'data', filename), JSON.stringify(jsonData), (writeFileError) => {
    if (writeFileError) {
      throw Error(writeFileError)
    }
  })
}

function isValidDate(value) {
  return value instanceof Date && !isNaN(value)
}

function hashWithMd5(data) {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest("hex")
}
