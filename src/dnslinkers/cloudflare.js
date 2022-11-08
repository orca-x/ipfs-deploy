'use strict'

// @ts-ignore
const dnslink = require('@orca-x/dnslink-cloudflare')
const isEmpty = require('lodash.isempty')

/**
 * @typedef {import('./types').DNSRecord} DNSRecord
 * @typedef {import('./types').CloudflareOptions} CloudflareOptions
 */

class Cloudflare {
  /**
   * @param {CloudflareOptions} options
   */
  constructor ({ apiEmail, apiKey, apiToken, zone, record }) {
    if ([apiKey, apiEmail, apiToken].every(isEmpty)) {
      throw new Error('apiEmail and apiKey or apiToken are required for Cloudflare')
    }

    if ([zone, record].some(isEmpty)) {
      throw new Error('zone and record are required for CloudFlare')
    }

    if (isEmpty(apiKey)) {
      this.api = { email: apiEmail, token: apiToken }
    } else {
      this.api = {
        email: apiEmail,
        key: apiKey
      }
    }

    const t_record = record === "@" ? zone : `${record}.${zone}`

    this.opts = { record: t_record, zone }
  }

  /**
   * @param {string} cid
   * @returns {Promise<DNSRecord>}
   */
  async link (cid) {
    const opts = {
      ...this.opts,
      link: `/ipfs/${cid}`
    }

    await dnslink(this.api, opts)

    return {
      record: opts.record,
      value: `dnslink=${opts.link}`,
    }
  }

  static get displayName () {
    return 'Cloudflare'
  }

  get displayName () {
    return Cloudflare.displayName
  }

  static get slug () {
    return 'cloudflare'
  }
}

module.exports = Cloudflare
