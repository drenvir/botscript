/**
 * Dialogue request (human context)
 */
export class Request {

  public botId: string;
  public sessionId: string;
  public message: string;
  public speechResponse: string;

  /**
   * This flag indicates the dialogue is forwarding
   * Bot must reset request and enter the new dialogue
   */
  public isForward: boolean;

  /**
   * This flag indicates the dialogue is flowing
   * Bot must enter the flow and resolve it
   */
  public isFlowing: boolean;

  /**
   * Dialogue flows in queue
   */
  public flows: string[];

  /**
   * Flows queue are resolved
   */
  public resolvedFlows: string[];

  /**
   * Flows are missing
   */
  public missingFlows: string[];

  /**
   * Human variables extracted in the conversation
   */
  public variables: any;

  /**
   * NLP extracted entities (current)
   */
  public entities: any;

  /**
   * Current flow to be resolved
   */
  public currentFlow: string;

  /**
   * Current flow resolved state
   */
  public currentFlowIsResolved: boolean;

  /**
   * Current talking dialogue
   */
  public currentDialogue: string;

  /**
   * Original talking dialogue
   */
  public originalDialogue: string;

  /**
   * Prompt human how to answer
   */
  public prompt: string[];

  /**
   * Initialize a new message request
   * @param message text input
   */
  constructor(message?: string) {
    this.flows = [];
    this.variables = {};
    this.isFlowing = false;
    this.resolvedFlows = [];
    this.missingFlows = [];

    if (message) {
      this.message = message.toLowerCase();
    }
  }

  /**
   * Update new message text
   * FOR: Testing
   * @param text
   */
  enter(text: string) {
    this.message = text;
    return this;
  }
}
