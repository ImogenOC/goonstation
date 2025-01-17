/**
 * @file
 * @copyright 2020
 * @author Mordent (https://github.com/mordent-goonstation)
 * @license ISC
 */

import { SFC } from 'inferno';
import { Tabs } from '../../../components';
import { EmptyPlaceholder } from '../EmptyPlaceholder';
import { ToolData } from '../type';

interface ToolProps {
  selected: boolean;
  onClick: () => void;
}

const Tool: SFC<ToolProps> = (props) => {
  const {
    children,
    onClick,
    selected,
  } = props;
  return (
    <Tabs.Tab onClick={onClick} selected={selected} >
      {children}
    </Tabs.Tab>
  );
};

interface ToolsProps {
  onSelectTool: (toolRef: string) => void;
  selectedToolRef: string | undefined;
  tools: ToolData[] | undefined;
}

export const Tools = (props: ToolsProps) => {
  const {
    onSelectTool,
    selectedToolRef,
    tools = [],
  } = props;
  if (tools.length === 0) {
    return <EmptyPlaceholder>Module has no tools</EmptyPlaceholder>;
  }
  return (
    <Tabs vertical>
      {tools.map(tool => {
        const {
          name,
          ref: toolRef,
        } = tool;
        return (
          <Tool
            key={toolRef}
            onClick={() => onSelectTool(toolRef)}
            selected={toolRef === selectedToolRef}
          >
            {name}
          </Tool>
        );
      })}
    </Tabs>
  );
};
