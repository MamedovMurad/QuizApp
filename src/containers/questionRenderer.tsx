import BlankQuestion from "../components/BlankQuestion";
import MultipleQuestion from "../components/MultipleQuestion";
import SingleQuestion from "../components/SingleQuestion";
import YesNoQuestion from "../components/YesNoQuestion";
import OrderingQuestion from "../components/OrderingQuestion";
import type { Question } from "../models/quiz";
import DragDropBlankQuestion from "../components/DragDropQuestion";

export default function QuestionRenderer({ question }: { question: Question }) {
 
  
  switch (question.type) {
    case "single":
      return <SingleQuestion question={question} />;
    case "multiple":
      return <MultipleQuestion question={question} />;
    case "blanks":
      return <BlankQuestion question={question} />;
    case "yesno":
      return <YesNoQuestion question={question} />;
    case "ordering":
      return <OrderingQuestion question={question} />;
        case "dragdrop":
      return <DragDropBlankQuestion question={question} />;
    default:
      return null;
  }
}

//