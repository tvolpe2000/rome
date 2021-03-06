/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Generator from '../../Generator';
import {ImportDeclaration, importDeclaration, AnyNode} from '@romejs/js-ast';

export default function ImportDeclaration(generator: Generator, node: AnyNode) {
  node = importDeclaration.assert(node);

  generator.word('import');
  generator.space();

  if (node.importKind === 'type' || node.importKind === 'typeof') {
    generator.word(node.importKind);
    generator.space();
  }

  generator.multiline(node, (multiline, node) => {
    const {namedSpecifiers, defaultSpecifier, namespaceSpecifier} = node;

    if (namedSpecifiers.length > 0 || namespaceSpecifier !== undefined ||
    defaultSpecifier !== undefined) {
      if (defaultSpecifier !== undefined) {
        generator.print(node.defaultSpecifier, node);
        if (namedSpecifiers.length > 0 || namespaceSpecifier !== undefined) {
          generator.token(',');
          generator.space();
        }
      }

      if (namespaceSpecifier !== undefined) {
        generator.print(namespaceSpecifier, node);
        if (namedSpecifiers.length > 0) {
          generator.token(',');
          generator.space();
        }
      }

      if (namedSpecifiers.length > 0) {
        generator.token('{');
        generator.printCommaList(namedSpecifiers, node, {
          multiline,
          trailing: true,
        });
        generator.token('}');
      }

      generator.space();
      generator.word('from');
      generator.space();
    }

    generator.print(node.source, node);
    generator.semicolon();
  }, {conditions: ['more-than-one-line']});
}
