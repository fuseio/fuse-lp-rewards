import React, { useState } from 'react'
import footerLogo from '@/assets/images/footer-logo.svg'
import twitterIcon from '@/assets/images/twitter_white.svg'
import twitterIconHover from '@/assets/images/twitter_footer_hover.svg'
import githubIcon from '@/assets/images/github_white.svg'
import githubIconHover from '@/assets/images/git_footer_hover.svg'
import mediumIcon from '@/assets/images/medium_white.svg'
import mediumIconHover from '@/assets/images/med_footer_hover.svg'
import discordIcon from '@/assets/images/discord.svg'
import discordIconHover from '@/assets/images/discord_footer_hover.svg'
import telegramIcon from '@/assets/images/tele.svg'
import telegramIconHover from '@/assets/images/telegram_footer_hover.svg'

const HoverIcon = ({ Icon, Hover, link }) => {
  const [isHover, setHover] = useState(false)
  return (
    <a
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
      rel='noreferrer noopener'
      className='footer__icon cell shrink'
      target='_blank'
      href={link}
    >
      {isHover ? <Hover /> : <Icon />}
    </a>
  )
}

const Footer = () => {
  return (
    <footer className='footer__wrapper grid-y align-center align-top'>
      <div className='footer cell medium-16 grid-x align-middle'>
        <div className='grid-x align-middle align-center'>
          <img className='logo' src={footerLogo} />
        </div>
        <div className='footer__icons grid-x align-center'>
          <HoverIcon
            link='https://twitter.com/fuse_network'
            Icon={() => (
              <div className='image' style={{ backgroundImage: `url(${twitterIcon})` }} />
            )}
            Hover={() => (
              <div className='image' style={{ backgroundImage: `url(${twitterIconHover})` }} />
            )}
          />
          <HoverIcon
            link='https://github.com/fuseio'
            Icon={() => (
              <div className='image' style={{ backgroundImage: `url(${githubIcon})` }} />
            )}
            Hover={() => (
              <div className='image' style={{ backgroundImage: `url(${githubIconHover})` }} />
            )}
          />
          <HoverIcon
            link='https://medium.com/fusenet'
            Icon={() => (
              <div className='image' style={{ backgroundImage: `url(${mediumIcon})` }} />
            )}
            Hover={() => (
              <div className='image' style={{ backgroundImage: `url(${mediumIconHover})` }} />
            )}
          />
          <HoverIcon
            link='https://discordapp.com/invite/jpPMeSZ'
            Icon={() => (
              <div className='image' style={{ backgroundImage: `url(${discordIcon})` }} />
            )}
            Hover={() => (
              <div className='image' style={{ backgroundImage: `url(${discordIconHover})` }} />
            )}
          />
          <HoverIcon
            link='https://t.me/fuseio'
            Icon={() => (
              <div className='image' style={{ backgroundImage: `url(${telegramIcon})` }} />
            )}
            Hover={() => (
              <div className='image' style={{ backgroundImage: `url(${telegramIconHover})` }} />
            )}
          />
        </div>
      </div>
      <div className='footer__text cell medium-8 grid-x align-start'>
        © 2021 Fuse. The Fuse network is a permissionless and border-less public ledger designed for easy integration of everyday payments.
      </div>
    </footer>
  )
}

export default Footer
