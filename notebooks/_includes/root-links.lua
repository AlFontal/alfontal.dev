-- Keep root-relative URLs (e.g. /posts/..., /blog/, /cv/) as site-absolute.
-- Every notebook is rendered as a Quarto project, so Quarto's project_paths
-- filter would otherwise rewrite '/x' to './x', which the notebook renderer then
-- joins onto the post's asset path. Runs before Quarto's filters; the attribute
-- is removed again by root-links-cleanup.lua.
local ignore = 'project-resolve-ignore'

local function isRootRelative(target)
  return target ~= nil and target:sub(1, 1) == '/' and target:sub(1, 2) ~= '//'
end

return {
  Link = function(el)
    if isRootRelative(el.target) then
      el.attributes[ignore] = 'true'
      return el
    end
  end,
  Image = function(el)
    if isRootRelative(el.src) then
      el.attributes[ignore] = 'true'
      return el
    end
  end,
}
