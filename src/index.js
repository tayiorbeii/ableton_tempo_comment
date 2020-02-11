const argv = require('minimist')(process.argv.slice(2))
const abletonParser = require('ableton-parser')
const osascript = require('node-osascript')
const lodash = require('lodash')
const { get } = lodash

async function setComment (fileName, tempo) {
  const appleScript = 'tell app \"Finder\" to set comment of (POSIX file f as alias) to c'

  try {
    await osascript.execute(appleScript, {f: fileName, c: tempo}, (err, result, raw) => {
      if (err) {
        console.error(err)
      }
    })
  } catch (err) {
    console.error(err)
  }
}

async function getTempoVal (fileName) {
  const tempo = await abletonParser.parseFile(fileName).then((res) => {
    const tempoVal = get(res, 'reader.xmlJs.Ableton.LiveSet.0.MasterTrack.0.DeviceChain.0.Mixer.0.Tempo.0.Manual.0.$.Value')

    return tempoVal
  })

  return tempo
}


async function main() {
  const fileName = argv._[0]
  const tempo = await getTempoVal(fileName)

  setComment(fileName, tempo)
  console.log(`Set the file comment to ${tempo}`)

}

main()