-- Remove the marker set by root-links.lua once Quarto has skipped the link,
-- so it doesn't leak into the HTML or force raw <a> tags in the GFM output.
local ignore = 'project-resolve-ignore'

local function clean(el)
  if el.attributes[ignore] ~= nil then
    el.attributes[ignore] = nil
    return el
  end
end

return {
  Link = clean,
  Image = clean,
}
