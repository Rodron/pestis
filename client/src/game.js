var width = 1280;
var height = 720;

var game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  debug: true,
  roundPixels: true,
  dom: {
    createContainer: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: width,
    height: height
  },
  scene: [
    candlegames.pestis.client.scenes.BaseScene,

    candlegames.pestis.client.scenes.Boot,
    candlegames.pestis.client.scenes.Loader,
    candlegames.pestis.client.scenes.MenuScene,
    candlegames.pestis.client.scenes.Game,
    candlegames.pestis.client.scenes.Credits,
    candlegames.pestis.client.scenes.Settings,
    candlegames.pestis.client.scenes.GameplayManager,
    candlegames.pestis.server.scenes.GameEngineScene
  ],
  plugins: {
    global: [
      { key: 'CommsSystemPlugin', plugin: candlegames.pestis.client.plugins.CommsSystem, mapping: 'comms', start: true },
      { key: 'UserSettings', plugin: candlegames.pestis.client.plugins.UserSettings, mapping: 'settings', start: true },

      { key: 'CharacterPlugin', plugin: candlegames.pestis.gameobjects.server.CharacterPlugin, start: true},
      { key: 'HideoutPlugin', plugin: candlegames.pestis.gameobjects.engine.HideoutPlugin, start: true},
      { key: 'GroundPlugin', plugin: candlegames.pestis.gameobjects.engine.GroundPlugin, start: true},
      { key: 'StairsSpotPlugin', plugin: candlegames.pestis.gameobjects.engine.StairsSpotPlugin, start: true},
      { key: 'StairsPlugin', plugin: candlegames.pestis.gameobjects.engine.StairsPlugin, start: true},

      { key: 'PlayerCharacterPlugin', plugin: candlegames.pestis.gameobjects.client.PlayerCharacterPlugin, start: true },
      { key: 'LanternPlugin', plugin: candlegames.pestis.gameobjects.client.LanternPlugin, start: true }
    ],
    scene: [
      { key: 'LoadingProgressBarPlugin', plugin: candlegames.pestis.client.plugins.LoadingProgressBar, mapping: 'loadingprogressbar' },
      { key: 'MusicSystemPlugin', plugin: candlegames.pestis.client.plugins.MusicSystem, mapping: 'music' },
      { key: 'MenuPlugin', plugin: candlegames.pestis.client.plugins.Menu, mapping: 'menu' },
      { key: 'InputManager', plugin: candlegames.pestis.client.plugins.InputManager, mapping: 'inputmanager' },
      { key: 'BrowserChecker', plugin: candlegames.pestis.client.plugins.BrowserChecker, mapping: 'browserchecker' },
      { key: 'GameEngine', plugin: candlegames.pestis.client.plugins.GameEngine, mapping: 'game_engine' },
      { key: 'RexUI', plugin: rexuiplugin, mapping: 'rexUI' }
      /* { key: 'DebugDrawPlugin', plugin: PhaserDebugDrawPlugin, mapping: 'debugDraw' } */
    ]
  }
});
