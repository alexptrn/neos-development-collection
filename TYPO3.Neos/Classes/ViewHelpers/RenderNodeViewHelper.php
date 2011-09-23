<?php
namespace TYPO3\TYPO3\ViewHelpers;

/*                                                                        *
 * This script belongs to the FLOW3 package "TYPO3".                      *
 *                                                                        *
 * It is free software; you can redistribute it and/or modify it under    *
 * the terms of the GNU General Public License as published by the Free   *
 * Software Foundation, either version 3 of the License, or (at your      *
 * option) any later version.                                             *
 *                                                                        *
 * This script is distributed in the hope that it will be useful, but     *
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHAN-    *
 * TABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General      *
 * Public License for more details.                                       *
 *                                                                        *
 * You should have received a copy of the GNU General Public License      *
 * along with the script.                                                 *
 * If not, see http://www.gnu.org/licenses/gpl.html                       *
 *                                                                        *
 * The TYPO3 project - inspiring people to share!                         *
 *                                                                        */

/**
 * Render node ViewHelper
 *
 * @scope singleton
 */
class RenderNodeViewHelper extends \TYPO3\Fluid\Core\ViewHelper\AbstractViewHelper {

	/**
	 * @inject
	 * @var \TYPO3\TypoScript\ObjectFactory
	 */
	protected $typoScriptObjectFactory;

	/**
	 * Render a node or a subnode of a node
	 *
	 * @param \TYPO3\TYPO3CR\Domain\Model\Node $node The node to render or the base node for rendering a child node
	 * @param string $path The child node path
	 * @return string The rendered node
	 * @author Christopher Hlubek <hlubek@networkteam.com>
	 * @author Sebastian Kurfürst <sebastian@typo3.org>
	 */
	public function render(\TYPO3\TYPO3CR\Domain\Model\Node $node, $path = NULL) {
		if ($path !== NULL) {
			$nodeToRender = $node->getNode($path);
		} else {
			$nodeToRender = $node;
		}

		$typoScriptObject = $this->typoScriptObjectFactory->createByNode($nodeToRender);
		$typoScriptObject->setRenderingContext($this->renderingContext);
		return $typoScriptObject->render();
	}

}
?>