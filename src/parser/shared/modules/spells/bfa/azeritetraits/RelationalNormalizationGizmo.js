import React from 'react';

import SPELLS from 'common/SPELLS/index';
import { formatNumber, formatPercentage } from 'common/format';
import { calculateAzeriteEffects } from 'common/stats';
import UptimeIcon from 'interface/icons/Uptime';
import PrimaryStatIcon from 'interface/icons/PrimaryStat';
import HasteIcon from 'interface/icons/Haste';
import AzeritePowerStatistic from 'interface/statistics/AzeritePowerStatistic';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import Analyzer from 'parser/core/Analyzer';
import StatTracker from 'parser/shared/modules/StatTracker';

const relationalNormalizationGizmoStats = traits => Object.values(traits).reduce((obj, rank) => {
  const [stat] = calculateAzeriteEffects(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO.id, rank);
  obj.stat += stat;
  return obj;
}, {
  stat: 0,
});

/**
 * Relational Normalization Gizmo
 * Your spells and abilities have a chance to grow or shrink the world. Shrinking the world grants you y primary stat and 26600 maximum health for 10 sec. Growing the world grants you x Haste and 25% movement speed for 10 sec.
 *
 * Example report: 
 */
class RelationalNormalizationGizmo extends Analyzer {
  static dependencies = {
    statTracker: StatTracker,
  };

  
  stat = 0;
  hasteProcs = 0;
  mainStatProcs = 0;
  
  variousProcs = [
    SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_HASTE.id,
    SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_MAIN_STAT.id
  ];

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO.id);
    if (!this.active) {
      return;
    }

    const { stat } = relationalNormalizationGizmoStats(this.selectedCombatant.traitsBySpellId[SPELLS.RELATIONAL_NORMALIZAIION_GIZMO.id]);
    this.stat = stat;

    this.statTracker.add(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_HASTE.id, {
      haste: stat,
    });	
	this.statTracker.add(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_MAIN_STAT.id, {
      strength: stat,
      intellect: stat,
      agility: stat,
    });
  }

  on_byPlayer_applybuff(event) {
    this.handleBuff(event);
  }

  on_byPlayer_refreshbuff(event) {
    this.handleBuff(event);
  }

  handleBuff(event) {
    if (event.ability.guid === SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_HASTE.id) {
      this.hasteProcs += 1;
      return;
    }

    if (event.ability.guid === SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_MAIN_STAT.id) {
      this.mainStatProcs += 1;
    }
  }

  uptime(spellID) {
    return this.selectedCombatant.getBuffUptime(spellID) / this.owner.fightDuration;
  }

  get averageUptime() {
    return this.variousProcs.reduce((a, b) => a + this.selectedCombatant.getBuffUptime(b), 0) / this.owner.fightDuration;
  }
  
  get averageHaste() {
    return (this.stat * this.uptime(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_HASTE.id)).toFixed(0);
  }
  get averageMainStat() {
    return (this.stat * this.uptime(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_MAIN_STAT.id)).toFixed(0);
  }

  statistic() {
    return (
	  <AzeritePowerStatistic size="flexible">
        <BoringSpellValueText
          spell={SPELLS.RELATIONAL_NORMALIZAIION_GIZMO}
          tooltip={(
            <>
              {SPELLS.ELEMENTAL_WHIRL.name} grants <strong>{this.stat}</strong> of a secondary stat while active.<br />
              <ul>
                <li>
                  You procced {SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_HASTE.name} <strong>{this.hasteProcs} {(this.hasteProcs > 1 || this.hasteProcs === 0) ? 'times' : 'time'}</strong>.
                  ({formatPercentage(this.uptime(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_HASTE.id))}% uptime)
                </li>
                <li>
                  You procced {SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_MAIN_STAT.name} <strong>{this.mainStatProcs} {(this.mainStatProcs > 1 || this.mainStatProcs === 0) ? 'times' : 'time'}</strong>.
                  ({formatPercentage(this.uptime(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_MAIN_STAT.id))}% uptime)
                </li>
              </ul>
            </>
          )}
        >
	      <UptimeIcon /> {formatPercentage(this.averageUptime, 0)}% <small>uptime</small><br />
          <HasteIcon /> {formatNumber(this.averageHaste)} <small>average Haste gained</small><br />
          <HasteIcon /> {formatNumber(this.averageMainStat)} <small>average Main Stat gained</small>
        </BoringSpellValueText>
      </AzeritePowerStatistic>
    );
  }
}
export default RelationalNormalizationGizmo;
