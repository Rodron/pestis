(function(ns) {
  function PlayerCharacter(scene, tiledSpawnPoint) {
    this.parseTiledObject(tiledSpawnPoint);

    Phaser.GameObjects.Sprite.call(this, scene, this._tiledObject.x, this._tiledObject.y,
      this._tiledProperties.spawn_object);

    this.id = this._tiledObject.id;
    this.name = this._tiledProperties.spawn_object;

    this.setOriginFromFrame();
    this.generateAnimations(this._tiledProperties.spawn_object);

    this.lantern = scene.add.lantern(this.x, this.y);
    this.lantern.setOrigin(this.originX, this.originY);

    this.createStateMachine({
        id: 'character',
        initial: 'grounded',
        context: {
          obj: this
        },
        states: {
          grounded: {
            initial: 'idle',
            states: {
              idle: {
                entry: 'startIdle'
              },
              walking: {
                entry: 'startWalking',
                on: {
                  STOP: 'idle'
                },
              },
              hiding: {
                entry: 'startHiding',
                on: {
                  STOP: 'idle'
                }
              },
              running: {},
              back: {
                type: 'history'
              },
            },
            on: {
              WALK: '.walking',
              RUN: '.running',
              HIDE: '.hiding',

              JUMP: 'jumping',

              STEP_DOWN: 'stepping.down',
              STEP_UP: 'stepping.up'
            }
          },
          jumping: {
            entry: 'startJumping',
            on: {
              GROUNDED: 'grounded.back'
            }
          },
          stepping: {
            states: {
              down: {
                entry: 'stairsDown',
                on: {
                  STEP_UP: 'up'
                }
              },
              up: {
                entry: 'stairsUp',
                on: {
                  STEP_DOWN: 'down'
                }
              }
            },
            on: {
              GROUNDED: 'grounded'
            }
          }
        }
      },{
        actions: {
          'startWalking': this._walk.bind(this),
          'startIdle': this._stop.bind(this),
          'startHiding': this._hide.bind(this),
          'startJumping': this._jump.bind(this),
          'stairsDown': this._stepDown.bind(this),
          'stairsUp': this._stepUp.bind(this),
        }
      }
    )
  }

  PlayerCharacter.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
  PlayerCharacter.prototype.constructor = PlayerCharacter;

  Phaser.Class.mixin(PlayerCharacter, [
    candlegames.pestis.gameobjects.components.State,
    candlegames.pestis.gameobjects.components.TiledObject,
    candlegames.pestis.gameobjects.components.Animated
  ]);

  /**
   *
   * @param context
   * @param event
   * @private
   */
  PlayerCharacter.prototype._jump = function(context, event) {
    this.play(this._animations.jump);
    this.lantern.play(this.lantern._animations.jump);
  }

  /**
   *
   * @param context
   * @param event
   * @private
   */
  PlayerCharacter.prototype._stepDown = function(context, event) {
    this.play(this._animations.stairsdown);
    this.lantern.play(this.lantern._animations.stairsdown);
  }

  /**
   *
   * @param context
   * @param event
   * @private
   */
  PlayerCharacter.prototype._stepUp = function(context, event) {
    this.play(this._animations.stairsup);
    this.lantern.play(this.lantern._animations.stairsup);
  }

  /**
   * Called when hide state is started
   * @param context
   * @param event
   * @private
   */
  PlayerCharacter.prototype._hide = function(context, event) {
      this.play(this._animations.hide);
      this.lantern.play(this.lantern._animations.hide);
  }

  /**
   * Called when walk state is started
   * @param context
   * @param event
   * @private
   */
  PlayerCharacter.prototype._walk = function(context, event) {
    console.log("Playing walk");
    this.play(this._animations.walk);
    this.lantern.play(this.lantern._animations.walk);
  }

  /**
   * Called when idle state is started
   * @param context
   * @param event
   * @private
   */
  PlayerCharacter.prototype._stop = function(context, event) {
    console.log("Playing idle");
    this.play(this._animations.idle);
    this.lantern.play(this.lantern._animations.idle);
  }

  /**
   * @override Phaser.GameObjects.Sprite
   */
  PlayerCharacter.prototype.setPosition = function(x, y, z, w) {
    if(Math.abs(this.x - x) > 0) {
      this.sendStateEvent('WALK');
      this.setFlipX(x < this.x);
    } else {
      this.sendStateEvent('STOP');
    }

    // Call parent setPosition
    Phaser.GameObjects.Sprite.prototype.setPosition.call(this, x, y, z, w);

    if(this.lantern !== undefined) {
      this.lantern.setFlipX(this.flipX);
      this.lantern.setPosition(this.x, this.y);
    }
  }

  PlayerCharacter.prototype.setWalkState = function(state) {
    if(state===0) {
      this.sendStateEvent('GROUNDED');
    } else if(state===1) {
      this.sendStateEvent('JUMP');
    } else if(state===2) {
      this.sendStateEvent('STEP_UP');
    } else if(state===3) {
      this.sendStateEvent('STEP_DOWN');
    } else if(state===4) {
      this.sendStateEvent('HIDE');
    }
  }

  ns.PlayerCharacter = PlayerCharacter;

  /**
   * Character gameobject loader plugin
   * @param pluginManager
   * @constructor
   */
  function PlayerCharacterPlugin(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);
    pluginManager.registerGameObject('playercharacter', this.createPlayerCharacter);
  }

  PlayerCharacterPlugin.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  PlayerCharacterPlugin.prototype.constructor = PlayerCharacterPlugin;

  PlayerCharacterPlugin.prototype.createPlayerCharacter = function(tiledSpawnPoint) {
    var character = new PlayerCharacter(this.scene, tiledSpawnPoint);
    this.scene.add.existing(character);
    return character;
  }

  ns.PlayerCharacterPlugin = PlayerCharacterPlugin;
})(candlegamestools.namespace('candlegames.pestis.gameobjects.client'));
