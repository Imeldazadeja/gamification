import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-question-dialog',
  templateUrl: './quiz-play.component.html',
  styleUrls: ['./quiz-play.component.scss'],
  animations: [
    trigger('flipCard', [
      state('true', style({
        transform: 'rotateY(180deg)'
      })),
      state('false', style({
        transform: 'rotateY(0)'
      })),
      transition('true => false', animate('800ms ease-out')),
      transition('false => true', animate('800ms ease-out'))
    ])
  ]
})

export class QuizPlayComponent implements OnInit {
  title: string = "the tech memory game";
  tagline: string = "Time to sharpen up those memory cells!";
  cards = [
    { name: "Card1", isFlipped: false },
    { name: "Card2", isFlipped: false },
    { name: "Card3", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
    { name: "Card1", isFlipped: false },
  ];
  total_cards_count: number = 3;
  prevCard = null;
  isProcessing: boolean = false;
  flippedCouplesCount: number = 0;

  constructor() { }

  playGame(card) {
    card.isFlipped = !card.isFlipped;
  }


  ngOnInit() {
  }

}