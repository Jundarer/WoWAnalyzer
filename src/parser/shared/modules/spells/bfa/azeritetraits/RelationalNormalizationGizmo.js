import React from 'react';

import SPELLS from 'common/SPELLS/index';
import { formatNumber, formatPercentage } from 'common/format';
import { calculateAzeriteEffects } from 'common/stats';
import UptimeIcon from 'interface/icons/Uptime';
import PrimaryStatIcon from 'interface/icons/PrimaryStat';
import HasteIcon from 'interface/icons/Haste';
import TraitStatisticBox, { STATISTIC_ORDER } from 'interface/others/TraitStatisticBox';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import Analyzer from 'parser/core/Analyzer';
import StatTracker from 'parser/shared/modules/StatTracker';

const relationalNormalizationGizmoHaste = traits => Object.values(traits).reduce((obj, rank) => {
  const [haste] = calculateAzeriteEffects(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO.id, rank);
  obj.haste += haste;
  return obj;
}, {
  haste: 0,
});

const relationalNormalizationGizmoPrimaryStat = traits => Object.values(traits).reduce((obj, rank) => {
  const [primaryStat] = calculateAzeriteEffects(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO.id, rank);
  obj.primaryStat += primaryStat;
  return obj;
}, {
  primaryStat: 0,
});

/**
 * Relational Normalization Gizmo
 * Your spells and abilities have a chance to grow or shrink the world. Shrinking the world grants you y primary stat and 26600 maximum health for 10 sec. Growing the world grants you x Haste and 25% movement speed for 10 sec.
 *
 * Example report: https://www.warcraftlogs.com/reports/jzx21fbnMkDvYCBF#fight=19&type=auras&source=11
 */
class RelationalNormalizationGizmo extends Analyzer {
  static dependencies = {
    statTracker: StatTracker,
  };

  
  haste = 0;
  primaryStat = 0;
  hasteProcs = 0;
  primaryStatProcs = 0;
  
  variousProcs = [
    SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_HASTE.id,
    SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_PRIMARY_STAT.id
  ];

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO.id);
    if (!this.active) {
      return;
    }
    
	//const { haste } = relationalNormalizationGizmoHaste(this.selectedCombatant.traitsBySpellId[SPELLS.RELATIONAL_NORMALIZAIION_GIZMO.id]);
    const { primaryStat } = relationalNormalizationGizmoPrimaryStat(this.selectedCombatant.traitsBySpellId[SPELLS.RELATIONAL_NORMALIZAIION_GIZMO.id]);
    //this.haste = haste;
	this.primaryStat = primaryStat;
	const ranks = this.selectedCombatant.traitRanks(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO.id) || [];
	this.haste=ranks.reduce((total,rank) => total + calculateAzeriteEffects(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO.id, rank)[0], 0);

    this.statTracker.add(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_HASTE.id, {
      haste: this.haste,
    });	
	this.statTracker.add(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_PRIMARY_STAT.id, {
      strength: this.primaryStat,
      intellect: this.primaryStat,
      agility: this.primaryStat,
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

    if (event.ability.guid === SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_PRIMARY_STAT.id) {
      this.primaryStatProcs += 1;
    }
  }

  uptime(spellID) {
    return this.selectedCombatant.getBuffUptime(spellID) / this.owner.fightDuration;
  }

  get averageUptime() {
    return this.variousProcs.reduce((a, b) => a + this.selectedCombatant.getBuffUptime(b), 0) / this.owner.fightDuration;
  }
  
  get averageHaste() {
    return (this.haste * this.uptime(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_HASTE.id)).toFixed(0);
  }
  get averagePrimaryStat() {
    return (this.primaryStat * this.uptime(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_PRIMARY_STAT.id)).toFixed(0);
  }

  statistic() {
    return (
      <TraitStatisticBox
        position={STATISTIC_ORDER.OPTIONAL()}
        trait={SPELLS.RELATIONAL_NORMALIZAIION_GIZMO.id}
        value={(
          <>
            <PrimaryStatIcon stat={this.selectedCombatant.spec.primaryStat} /> {formatNumber(this.averagePrimaryStat)} <small>average Primary Stat gained</small><br />
			<HasteIcon  /> {formatNumber(this.averageHaste)} <small> average Haste gained</small>
          </>
        )}
        tooltip={(
          <>
            {SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_HASTE.name} grants <strong>{this.haste} Haste</strong> while active.<br />
            {SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_PRIMARY_STAT.name} grants <strong>{this.primaryStat} Primary Stat</strong> while active.<br />
            You procced <strong>{SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_HASTE.name} {this.hasteProcs} times</strong> with an uptime of {formatPercentage(this.uptime(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_HASTE.id))}%.<br />
			You procced <strong>{SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_PRIMARY_STAT.name} {this.primaryStatProcs} times</strong> with an uptime of {formatPercentage(this.uptime(SPELLS.RELATIONAL_NORMALIZAIION_GIZMO_PRIMARY_STAT.id))}%.
          </>
        )}
      />
    );
  }
}
export default RelationalNormalizationGizmo;
