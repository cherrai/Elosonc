import { LogLevel, Printer, Renderer, logLevelToEnum, LogLevelEnum } from './core.js'
import { IFont, font } from 'terminal-font'
import * as R from 'ramda'

const styleMap: Record<LogLevel, IFont> = {
  ALERT: font().red(),
  CRITICAL: font().red(),
  DEBUG: font().white(),
  EMERGENCY: font().red(),
  ERROR: font().red(),
  INFO: font().green(),
  NOTICE: font().green(),
  WARN: font().yellow(),
}

const myToString = (x: unknown) => {
  return typeof x === 'object' ? JSON.stringify(x, null, 2) : `${x}`
}

const defaultRenderer: Renderer<unknown, string> = ({ level, content }) =>
  styleMap[level].apply(`[${new Date().toLocaleString('ja-jp')} ${level}] ${myToString(content)}`)

const defaultPrinter: Printer<string> = ({ level, rendered, logLevel }) => {
  const level2 = logLevelToEnum(level)
  const logLevel2 = logLevelToEnum(logLevel)
  const stdout = level2 <= LogLevelEnum.WARN ? process.stderr : process.stdout

  level2 <= logLevel2 &&
    (() => {
      stdout.write(rendered)
      stdout.write('\n')
    })()
}

const identityRenderer: Renderer<unknown, string> = ({ content }) => `${content}`

const syslog: <P>(source: Renderer<P, string>) => Renderer<P, string> =
  (source) =>
  ({ level, content, logLevel }) =>
    `<${logLevelToEnum(level)}>${source({ level, content, logLevel })}`

export { defaultRenderer, defaultPrinter, identityRenderer, syslog }
