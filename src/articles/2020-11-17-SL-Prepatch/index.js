import React from 'react';
import { Link } from 'react-router-dom';
import { Dambroda } from 'CONTRIBUTORS';
import RegularArticle from 'interface/news/RegularArticle';

import ShadowlandsBackground from './sl-bg-wide.jpg';

export default (
  <RegularArticle title="Welcome to the Shadowlands prepatch"
    publishedAt="2020-10-14"
    publishedBy={Dambroda}>
    <img src={ShadowlandsBackground} alt="Shadowlands Wallpaper" /><br /><br />

    The Battle for Azeroth was a wild ride, but is it coming to an end. The Shadowlands
    pre-expansion patch is now live; the expansion launch and its first tier <em>Castle Nathria</em>
    soon to follow. We are proud to go into the Shadowlands with tons of new features and
    improvements since we were last here at the start of BFA. Boss phase filtering, guild reports
    search, a full site-wide UI revamp, and consistent spec updates definitely kept us busy for the
    last two years.

    <br/><br/>That said... now, more than ever, we need <em>you</em>. In Shadowlands, classes and specs are
    getting more changes at once than ever before. We've been hard at work for the past months
    researching on the beta, scouring through reports, and collaborating with class experts to bring
    you the best metrics and suggestions possible to help improve your play. However, time is short
    and some specs are still in need of loving maintenance. Please check out
    the <Link to="/specs">specs</Link> tab or our
    our <a href="https://github.com/WoWAnalyzer/WoWAnalyzer/issues">GitHub</a> to see if you might
    be able to help. Then, join our <a href="https://discord.gg/AxphPxU">Discord</a> for common
    questions, assistance, and feedback. We provide monthly gametime to spec maintainers!

    <br/><br/>During the prepatch, analysis might be a bit skewed or missing some of the suggestions
    and statistics you are used to seeing. To aid us in the massive expansion overhaul, we've been
    trimming some of the BFA features, even if they aren't disabled for prepatch. We hope you bear
    with us while we're under construction!

    <br/><br/>We are looking forward to providing you top tier personal play analysis for Shadowlands,
    Castle Nathria, and beyond. Thank you for your support, we hope you stick around.

    <br/>- The WoWAnalyzer Team

    <br/><br/>Please consider showing your support via <Link to="premium">premium</Link> if you
    appreciate this fan-made project. No ads, discord roles, and the knowledge you're helping
    keep us moving forward!
  </RegularArticle>
);
