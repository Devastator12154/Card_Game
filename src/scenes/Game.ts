import Phaser from "phaser";
import Card from './helpers/Card';
import Zone from "./helpers/zone";
import io from 'socket.io-client';
import Dealer from './helpers/dealer';

export default class Game extends Phaser.Scene {
    dealText: Phaser.GameObjects.Text;
    card: Phaser.GameObjects.Image;
    dealCards: () => void;
    zone: Zone;
    dropZone: any;
    outline: any;
    socket: any;
    isPlayerA: boolean;
    opponentCards: any[];
    dealer: Dealer;
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        this.load.image('cyanCardFront', 'assets/Action-Amulet of Lightning-Blue.jpg');
        this.load.image('cyanCardBack', 'assets/Cardback.png');
        this.load.image('magentaCardFront', 'assets/Action-Autumn\'s Touch -Blue.jpg');
        this.load.image('magentaCardBack', 'assets/Cardback.png');
    }

    create() {
        this.isPlayerA = false;
        this.opponentCards = [];
        const newLocal = this;
        newLocal.socket = io('http://localhost:3000',{});

        this.socket.on('connect', function () {
        	console.log('Connected!');
            
        });
        this.socket.on('isPlayerA', function () {
        	self.isPlayerA = true;
        })

        this.socket.on('dealCards', function () {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        })

        this.socket.on('cardPlayed', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                let card = new Card(self);
                card.render(((self.dropZone.x - 350) + (self.dropZone.data.values.cards * 50)), (self.dropZone.y), sprite).disableInteractive();
            }
        })

        this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        let self = this;

		// this.card = this.add.image(300, 300, 'cyanCardFront').setScale(0.3, 0.3).setInteractive();
        // this.input.setDraggable(this.card);

		// this.dealCards = () => {
        //         for (let i = 0; i < 5; i++) {
        //             let playerCard = new Card(this);
        //             playerCard.render(475 + (i * 100), 650, 'cyanCardFront');
        //         }
        // }

        this.dealer = new Dealer(this);
        
		this.dealText.on('pointerdown', function () {
            self.socket.emit("dealCards");
            // self.dealCards();
        })

        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        })

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#00ffff');
        })

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })
        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject);
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            dropZone.data.values.cards++;
            gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
            gameObject.y = dropZone.y;
            gameObject.disableInteractive();
            self.socket.emit('cardPlayed', gameObject, self.isPlayerA)
        })
        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);
    }
    
    update() {
    
    }
}

