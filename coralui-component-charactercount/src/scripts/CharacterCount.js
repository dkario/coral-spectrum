/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2017 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

import Component from 'coralui-mixin-component';
import {transform} from 'coralui-util';

const CLASSNAME = 'coral3-CharacterCount';

/**
 Enumeration representing the possible targets for the CharacterCount.
 
 @enum {String}
 @memberof Coral.CharacterCount
 */
const target = {
  /** Relates the CharacterCount to the previous sibling. */
  PREVIOUS: '_prev',
  /** Relates the CharacterCount to the next sibling. */
  NEXT: '_next'
};

/**
 @class Coral.CharacterCount
 @classdesc A CharacterCount component
 @htmltag coral-charactercount
 @extends HTMLElement
 @extends Coral.mixin.component
 */
class CharacterCount extends Component(HTMLElement) {
  constructor() {
    super();
  }
  
  /**
   The target Textfield or Textarea for this component. It accepts values from {@link Coral.CharacterCount.target},
   as well as any DOM element or CSS selector.
   
   @type {Coral.CharacterCount.target|HTMLElement|String}
   @default Coral.CharacterCount.target.PREVIOUS
   @htmlattribute target
   @memberof Coral.CharacterCount#
   */
  get target() {
    return this._target || target.PREVIOUS;
  }
  set target(value) {
    if (typeof value === 'string' || value instanceof Node) {
      this._target = value;
  
      // Remove previous event listener
      if (this._targetEl) {
        this._targetEl.removeEventListener('input', this._refreshCharCount.bind(this));
      }
  
      // Get the target DOM element
      if (value === target.NEXT) {
        this._targetEl = this.nextElementSibling;
      }
      else if (value === target.PREVIOUS) {
        this._targetEl = this.previousElementSibling;
      }
      else if (typeof value === 'string') {
        this._targetEl = document.querySelector(value);
      }
      else {
        this._targetEl = value;
      }
  
      if (this._targetEl) {
        this._targetEl.addEventListener('input', this._refreshCharCount.bind(this));
    
        // Try to get maxlength from target element
        if (this._targetEl.getAttribute('maxlength')) {
          this.maxLength = this._targetEl.getAttribute('maxlength');
        }
      }
    }
  }
  
  /**
   Maximum character length for the TextField/TextArea (will be read from target field markup if able).
   
   @type {Number}
   @default null
   @htmlattribute maxlength
   @htmlattributereflected
   @memberof Coral.CharacterCount#
   */
  get maxLength() {
    return this._maxLength || null;
  }
  set maxLength(value) {
    this._maxLength = transform.number(value);
    this._reflectAttribute('maxlength', this._maxLength);
    
    this._refreshCharCount();
  }
  
  /** @ignore */
  _getCharCount() {
    let elementLength = 0;
    if (this._targetEl && this._targetEl.value) {
      elementLength = this._targetEl.value.length;
    }
    
    return this._maxLength ? (this._maxLength - elementLength) : elementLength;
  }
  
  /** @ignore */
  _refreshCharCount() {
    const currentCount = this._getCharCount();
    this.innerHTML = currentCount;
    const isMaxExceeded = currentCount < 0;
    if (this._targetEl) {
      this._targetEl.classList.toggle('is-invalid', isMaxExceeded);
      this.classList.toggle('is-invalid', isMaxExceeded);
    }
  }
  
  get _attributes() {return {maxlength: 'maxLength'};}
  
  // Expose enumerations
  static get target() {return target;}
  
  static get observedAttributes() {
    return ['target', 'maxlength', 'maxLength'];
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    this.classList.add(CLASSNAME);
    
    // Set defaults
    this.target = this.target;
    if (!this._maxLength) {this.maxLength = this._maxLength;}
  }
}

export default CharacterCount;